-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON attendance;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON attendance;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON attendance;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON attendance;

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy for reading attendance records
CREATE POLICY "Enable read access for all users" ON attendance
  FOR SELECT USING (true);

-- Policy for inserting attendance records
CREATE POLICY "Enable insert for all users" ON attendance
  FOR INSERT WITH CHECK (true);

-- Policy for updating attendance records
CREATE POLICY "Enable update for admins and own records" ON attendance
  FOR UPDATE USING (
    (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
    OR 
    (user_id IN (SELECT id FROM users WHERE id_number = current_setting('app.current_user_id', TRUE)::text))
    OR
    (user_id = auth.uid())
  );

-- Policy for deleting attendance records
CREATE POLICY "Enable delete for admins only" ON attendance
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  ); 