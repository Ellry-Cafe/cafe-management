-- Drop existing role check constraint
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add updated role check constraint with all roles
ALTER TABLE public.users
ADD CONSTRAINT profiles_role_check 
CHECK (role IN (
    'admin',
    'staff',
    'cashier',
    'manager',
    'barista',
    'cook',
    'assistant_cook',
    'dining_crew',
    'kitchen_crew',
    'inventory_manager',
    'supervisor'
)); 