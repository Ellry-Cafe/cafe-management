-- Fix the request_type enum issue
-- This will update the database to accept the correct enum values

-- First, drop the old enum if it exists
DROP TYPE IF EXISTS public.request_type CASCADE;
DROP TYPE IF EXISTS public.request_status CASCADE;

-- Create the new enums with the correct values
CREATE TYPE public.request_type AS ENUM ('cash_advance', 'absence', 'overtime');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'denied');

-- Drop the old requests table if it exists (since it has the wrong structure)
DROP TABLE IF EXISTS public.requests CASCADE;

-- Create the requests table with the correct structure
CREATE TABLE public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    request_type public.request_type NOT NULL,
    status public.request_status NOT NULL DEFAULT 'pending',
    
    -- Common fields
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT,

    -- Cash Advance specific
    amount NUMERIC(10, 2),

    -- Overtime specific
    overtime_in TIMESTAMP WITH TIME ZONE,
    overtime_out TIMESTAMP WITH TIME ZONE,
    duration REAL, -- in hours

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_type ON public.requests(request_type);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);

-- Enable Row Level Security
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

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update 'updated_at'
CREATE TRIGGER update_requests_updated_at_trigger
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.update_requests_updated_at(); 