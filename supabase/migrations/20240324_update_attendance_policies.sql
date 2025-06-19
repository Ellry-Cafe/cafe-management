-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can insert own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can update own active attendance" ON public.attendance;
DROP POLICY IF EXISTS "Admins can view all attendance" ON public.attendance;
DROP POLICY IF EXISTS "Admins can insert any attendance" ON public.attendance;
DROP POLICY IF EXISTS "Admins can update any attendance" ON public.attendance;
DROP POLICY IF EXISTS "Admins can delete any attendance" ON public.attendance;

-- Create new policies that support both authenticated and public access

-- Anyone can view attendance records (needed for kiosk mode)
CREATE POLICY "Allow viewing attendance records" ON public.attendance
    FOR SELECT USING (true);

-- Anyone can insert attendance records (needed for kiosk mode)
CREATE POLICY "Allow inserting attendance records" ON public.attendance
    FOR INSERT WITH CHECK (true);

-- Anyone can update active attendance records (needed for kiosk mode)
CREATE POLICY "Allow updating active attendance records" ON public.attendance
    FOR UPDATE USING (status = 'active');

-- Only admins can delete attendance records
CREATE POLICY "Only admins can delete attendance records" ON public.attendance
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    ); 