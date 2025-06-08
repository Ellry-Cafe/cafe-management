BEGIN;
  -- Drop existing policies if any
  DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
  DROP POLICY IF EXISTS "Give users upload access to own folder" ON storage.objects;
  DROP POLICY IF EXISTS "Give users update access to own folder" ON storage.objects;
  DROP POLICY IF EXISTS "Give users delete access to own folder" ON storage.objects;

  -- Create a single policy that handles all operations
  CREATE POLICY "Manage user files access"
  ON storage.objects
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'user-files' AND (
      CASE 
        -- For SELECT: Users can view their own files, admins can view all
        WHEN current_setting('request.method', true) = 'GET' THEN
          (storage.foldername(name))[1] = auth.uid()::text OR auth.jwt() ->> 'role' = 'admin'
        
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