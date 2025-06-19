-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    clock_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    clock_out TIMESTAMP WITH TIME ZONE,
    total_hours DECIMAL(5,2),
    location TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_clock_in ON public.attendance(clock_in);
CREATE INDEX IF NOT EXISTS idx_attendance_user_status ON public.attendance(user_id, status);

-- Enable Row Level Security
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can view their own attendance records
CREATE POLICY "Users can view own attendance" ON public.attendance
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own attendance records
CREATE POLICY "Users can insert own attendance" ON public.attendance
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own active attendance records
CREATE POLICY "Users can update own active attendance" ON public.attendance
    FOR UPDATE USING (auth.uid() = user_id AND status = 'active');

-- Admins can view all attendance records
CREATE POLICY "Admins can view all attendance" ON public.attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can insert attendance records for any user
CREATE POLICY "Admins can insert any attendance" ON public.attendance
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can update any attendance record
CREATE POLICY "Admins can update any attendance" ON public.attendance
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can delete any attendance record
CREATE POLICY "Admins can delete any attendance" ON public.attendance
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_attendance_updated_at();

-- Create function to calculate total hours when clock_out is set
CREATE OR REPLACE FUNCTION public.calculate_attendance_hours()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clock_out IS NOT NULL AND OLD.clock_out IS NULL THEN
        NEW.total_hours = EXTRACT(EPOCH FROM (NEW.clock_out - NEW.clock_in)) / 3600;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate total hours
CREATE TRIGGER calculate_attendance_hours
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_attendance_hours();

-- Create function to prevent multiple active records per user
CREATE OR REPLACE FUNCTION public.prevent_multiple_active_attendance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'active' THEN
        -- Check if user already has an active attendance record
        IF EXISTS (
            SELECT 1 FROM public.attendance 
            WHERE user_id = NEW.user_id 
            AND status = 'active'
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        ) THEN
            RAISE EXCEPTION 'User already has an active attendance record';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent multiple active records
CREATE TRIGGER prevent_multiple_active_attendance
    BEFORE INSERT OR UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_multiple_active_attendance();

-- Add comments to table and columns
COMMENT ON TABLE public.attendance IS 'Staff attendance records for clock-in/out tracking';
COMMENT ON COLUMN public.attendance.id IS 'Unique identifier for the attendance record';
COMMENT ON COLUMN public.attendance.user_id IS 'Reference to the user who clocked in/out';
COMMENT ON COLUMN public.attendance.clock_in IS 'Timestamp when the user clocked in';
COMMENT ON COLUMN public.attendance.clock_out IS 'Timestamp when the user clocked out';
COMMENT ON COLUMN public.attendance.total_hours IS 'Total hours worked (calculated automatically)';
COMMENT ON COLUMN public.attendance.location IS 'Optional location where the user clocked in/out';
COMMENT ON COLUMN public.attendance.notes IS 'Optional notes about the attendance record';
COMMENT ON COLUMN public.attendance.status IS 'Status of the attendance record (active/completed/cancelled)';
COMMENT ON COLUMN public.attendance.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.attendance.updated_at IS 'Timestamp when the record was last updated'; 