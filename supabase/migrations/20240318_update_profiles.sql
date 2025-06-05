-- Drop existing policies
DO $$ 
BEGIN
    -- Drop all policies that might exist
    EXECUTE (
        SELECT string_agg(
            format('DROP POLICY IF EXISTS %I ON public.profiles;', policyname),
            E'\n'
        )
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles'
    );
END $$;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    username TEXT UNIQUE,
    role TEXT DEFAULT 'staff',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple read policy - all authenticated users can read
CREATE POLICY "profiles_read_policy" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Simple write policy - only admins can write
CREATE POLICY "profiles_write_policy" ON public.profiles
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Users can update their own profile
CREATE POLICY "profiles_self_update_policy" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;

-- Create the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, username, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- Update admin user metadata if exists
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
    'role', 'admin',
    'name', 'Admin User',
    'username', 'admin'
)
WHERE email = 'admin@cafe.com';

-- Update admin profile if exists
UPDATE public.profiles
SET 
    role = 'admin',
    name = 'Admin User',
    username = 'admin'
WHERE email = 'admin@cafe.com'; 