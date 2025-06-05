-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'staff', 'cashier', 'manager')) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT NOW(),
  username TEXT UNIQUE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    _role text;
    _name text;
    _username text;
BEGIN
    -- Debug logging
    RAISE LOG 'handle_new_user() called for user ID: %', NEW.id;
    RAISE LOG 'Raw user metadata: %', NEW.raw_user_meta_data;
    
    -- Extract values with detailed logging
    _role := COALESCE(NEW.raw_user_meta_data->>'role', 'staff');
    _name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    _username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
    
    RAISE LOG 'Extracted values - Role: %, Name: %, Username: %', _role, _name, _username;
    
    -- Insert the new profile
    INSERT INTO public.profiles (
        id,
        email,
        name,
        username,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        _name,
        _username,
        _role
    );
    
    RAISE LOG 'Profile created successfully for user ID: %', NEW.id;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user(): % %', SQLERRM, SQLSTATE;
        RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for users based on auth.uid()" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on auth.uid()" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow full access to admin users" ON public.profiles;
CREATE POLICY "Allow full access to admin users" ON public.profiles
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Ensure the function has proper permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role; 