-- Update existing storage bucket or create if not exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'user-files') THEN
        -- Update existing bucket
        UPDATE storage.buckets 
        SET 
            public = true,
            file_size_limit = 10485760,
            allowed_mime_types = ARRAY[
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]::text[]
        WHERE id = 'user-files';
    ELSE
        -- Create new bucket if it doesn't exist
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'user-files',
            'User Files Storage',
            true,
            10485760, -- 10MB
            ARRAY[
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]::text[]
        );
    END IF;
END $$;

-- Create policies for the storage bucket
BEGIN;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Manage user files access" ON storage.objects;

-- Create a single policy that handles all operations
CREATE POLICY "Manage user files access"
ON storage.objects
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  bucket_id = 'user-files' AND (
    CASE 
      -- For SELECT: Anyone can view files (since bucket is public)
      WHEN current_setting('request.method', true) = 'GET' THEN
        true
      
      -- For INSERT: Users can only upload to their own folder
      WHEN current_setting('request.method', true) = 'POST' THEN
        (storage.foldername(name))[1] = auth.uid()::text
      
      -- For UPDATE/DELETE: Users can manage their own files, admins can manage all
      WHEN current_setting('request.method', true) IN ('PUT', 'DELETE') THEN
        (storage.foldername(name))[1] = auth.uid()::text OR auth.jwt() ->> 'role' = 'admin'
      
      ELSE false
    END
  )
);

COMMIT; 