-- Rename profiles table to users
ALTER TABLE IF EXISTS public.profiles RENAME TO users;

-- Update references in RLS policies
ALTER POLICY "Enable read access for all users" ON public.users RENAME TO "Enable read access for all authenticated users";

ALTER POLICY "Enable insert for users based on auth.uid()" ON public.users RENAME TO "Enable insert for authenticated users based on auth.uid()";

ALTER POLICY "Enable update for users based on auth.uid()" ON public.users RENAME TO "Enable update for authenticated users based on auth.uid()";

ALTER POLICY "Allow full access to admin users" ON public.users RENAME TO "Allow full access to administrators";

-- Update trigger name to reflect new table name
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Update function to use new table name
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
    
    -- Insert into users table instead of profiles
    INSERT INTO public.users (
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
    
    RAISE LOG 'User created successfully for ID: %', NEW.id;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user(): % %', SQLERRM, SQLSTATE;
        RETURN NEW;
END;
$$; 