-- First, disable RLS temporarily to ensure we can modify policies
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow viewing attendance records" ON public.attendance;
DROP POLICY IF EXISTS "Allow inserting attendance records" ON public.attendance;
DROP POLICY IF EXISTS "Allow updating active attendance records" ON public.attendance;
DROP POLICY IF EXISTS "Only admins can delete attendance records" ON public.attendance;

-- Re-enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create a single policy for all operations (except delete)
CREATE POLICY "Allow all attendance operations" ON public.attendance
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Keep delete restricted to admins only
CREATE POLICY "Restrict delete to admins" ON public.attendance
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    ); 