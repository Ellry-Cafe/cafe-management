import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ksehteheheizhrylwrxr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZWh0ZWhlaGVpemhyeWx3cnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjI5OTUsImV4cCI6MjA2NDE5ODk5NX0.A6I2w65qoNg_rc5ytvGp0gO4rRY56YcAQRCepnHI4yg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 