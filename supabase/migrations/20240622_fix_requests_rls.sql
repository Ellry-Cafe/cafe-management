-- Fix RLS policies for requests table to allow public access
-- This is needed for the staff attendance system that doesn't use authentication

-- First, disable RLS temporarily to ensure we can modify policies
ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.requests;
DROP POLICY IF EXISTS "Admins can update any request" ON public.requests;

-- Re-enable RLS
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public access for staff attendance system
-- 1. Allow anyone to insert requests (needed for staff attendance)
CREATE POLICY "Allow inserting requests" ON public.requests
    FOR INSERT WITH CHECK (true);

-- 2. Allow anyone to view requests (needed for staff attendance)
CREATE POLICY "Allow viewing requests" ON public.requests
    FOR SELECT USING (true);

-- 3. Allow admins to update any request
CREATE POLICY "Admins can update any request" ON public.requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- 4. Allow admins to delete any request
CREATE POLICY "Admins can delete any request" ON public.requests
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    ); 