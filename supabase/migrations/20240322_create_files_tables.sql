-- Create enum for file types
CREATE TYPE file_type AS ENUM (
    'profile_photo',
    'id_photo',
    'resume',
    'contract',
    'certification',
    'other'
);

-- Create files table
CREATE TABLE IF NOT EXISTS public.files (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name text NOT NULL,
    file_type file_type NOT NULL,
    file_url text NOT NULL,
    file_size bigint,
    mime_type text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_files junction table
CREATE TABLE IF NOT EXISTS public.user_files (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    file_id uuid REFERENCES public.files(id) ON DELETE CASCADE,
    is_active boolean DEFAULT true,
    description text,
    valid_from date,
    valid_until date,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, file_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_user_files_user_id ON public.user_files(user_id);
CREATE INDEX idx_user_files_file_id ON public.user_files(file_id);
CREATE INDEX idx_files_file_type ON public.files(file_type);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- Create policies for files table
CREATE POLICY "Enable read access for authenticated users" ON public.files
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON public.files
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for admin users" ON public.files
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable delete for admin users" ON public.files
    FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for user_files table
CREATE POLICY "Enable read access for authenticated users" ON public.user_files
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON public.user_files
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for admin users" ON public.user_files
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable delete for admin users" ON public.user_files
    FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON public.files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_files_updated_at
    BEFORE UPDATE ON public.user_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Remove old file URL columns from users table
ALTER TABLE public.users
DROP COLUMN IF EXISTS profile_photo_url,
DROP COLUMN IF EXISTS id_photo_url,
DROP COLUMN IF EXISTS resume_url,
DROP COLUMN IF EXISTS contract_url; 