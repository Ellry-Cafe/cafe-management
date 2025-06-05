-- Create enum types for status and roles
CREATE TYPE user_status AS ENUM ('in', 'out', 'break');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE request_type AS ENUM ('Cash Advance', 'Leave of absence');

-- Update the profiles table to add staff-specific fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text,
ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'out',
ADD COLUMN IF NOT EXISTS shift_time text,
ADD COLUMN IF NOT EXISTS department text;

-- Create the requests table
CREATE TABLE IF NOT EXISTS public.requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type request_type NOT NULL,
    staff_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_name text NOT NULL,
    amount decimal(10,2),
    details text,
    status request_status DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert sample staff data
INSERT INTO public.profiles (id, name, role, status, shift_time, department, created_at) VALUES
    (gen_random_uuid(), 'Allia', 'staff', 'out', '8:00 am - 5:30 pm', 'dining', NOW()),
    (gen_random_uuid(), 'Harlyn', 'staff', 'in', '10:00 am - 5:30 pm', 'dining', NOW()),
    (gen_random_uuid(), 'Saysay', 'staff', 'out', '5:00 pm - 11:30 pm', 'dining', NOW()),
    (gen_random_uuid(), 'Marco', 'kitchen', NULL, '8:00 am - 5:30 pm', 'kitchen', NOW()),
    (gen_random_uuid(), 'Ian', 'kitchen', NULL, '10:00 am - 5:30 pm', 'kitchen', NOW()),
    (gen_random_uuid(), 'Val', 'kitchen', NULL, '5:00 pm - 11:30 pm', 'kitchen', NOW());

-- Get staff IDs for requests
DO $$ 
DECLARE 
    marco_id uuid;
    val_id uuid;
    ian_id uuid;
BEGIN
    SELECT id INTO marco_id FROM public.profiles WHERE name = 'Marco' LIMIT 1;
    SELECT id INTO val_id FROM public.profiles WHERE name = 'Val' LIMIT 1;
    SELECT id INTO ian_id FROM public.profiles WHERE name = 'Ian' LIMIT 1;

    -- Insert sample requests
    INSERT INTO public.requests (type, staff_id, staff_name, amount, details, status, created_at) VALUES
        ('Cash Advance', marco_id, 'Marco', 1000.00, NULL, 'pending', NOW()),
        ('Cash Advance', val_id, 'Val', 500.00, NULL, 'approved', NOW()),
        ('Leave of absence', ian_id, 'Ian', NULL, 'important matters', 'approved', NOW());
END $$; 