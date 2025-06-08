-- Create enum for contract type
CREATE TYPE contract_type AS ENUM ('Full time', 'Part-time');

-- Add new columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS contact_number text,
ADD COLUMN IF NOT EXISTS emergency_contact text,
ADD COLUMN IF NOT EXISTS birthdate date,
ADD COLUMN IF NOT EXISTS present_address text,
ADD COLUMN IF NOT EXISTS contract_type contract_type,
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS profile_photo_url text,
ADD COLUMN IF NOT EXISTS id_photo_url text,
ADD COLUMN IF NOT EXISTS resume_url text,
ADD COLUMN IF NOT EXISTS contract_url text;

-- Create a function to split existing name into first_name and last_name
CREATE OR REPLACE FUNCTION split_full_name()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET 
    first_name = split_part(name, ' ', 1),
    last_name = CASE 
      WHEN array_length(string_to_array(name, ' '), 1) > 1 
      THEN trim(substring(name from position(' ' in name)))
      ELSE ''
    END
  WHERE name IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT split_full_name();

-- Drop the function as it's no longer needed
DROP FUNCTION split_full_name();

-- Update the handle_new_user function to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    _role text;
    _first_name text;
    _last_name text;
    _username text;
BEGIN
    -- Extract values with detailed logging
    _role := COALESCE(NEW.raw_user_meta_data->>'role', 'staff');
    _first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1));
    _last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    _username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
    
    -- Insert into users table with new fields
    INSERT INTO public.users (
        id,
        email,
        first_name,
        last_name,
        username,
        role,
        name -- Keep this for backward compatibility
    ) VALUES (
        NEW.id,
        NEW.email,
        _first_name,
        _last_name,
        _username,
        _role,
        _first_name || ' ' || _last_name
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user(): % %', SQLERRM, SQLSTATE;
        RETURN NEW;
END;
$$; 