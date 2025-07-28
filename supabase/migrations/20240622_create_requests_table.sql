-- Create the request_type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_type') THEN
        CREATE TYPE public.request_type AS ENUM ('cash_advance', 'absence', 'overtime');
    END IF;
END$$;

-- Create the request_status enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'denied');
    END IF;
END$$;

-- Create requests table
CREATE TABLE IF NOT EXISTS public.requests (
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

-- RLS POLICIES
-- 1. Users can insert their own requests
CREATE POLICY "Users can insert their own requests"
ON public.requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Users can view their own requests
CREATE POLICY "Users can view their own requests"
ON public.requests
FOR SELECT USING (auth.uid() = user_id);

-- 3. Admins can view all requests
CREATE POLICY "Admins can view all requests"
ON public.requests
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- 4. Admins can update any request
CREATE POLICY "Admins can update any request"
ON public.requests
FOR UPDATE USING (
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