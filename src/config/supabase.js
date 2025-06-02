import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ksehteheheizhrylwrxr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZWh0ZWhlaGVpemhyeWx3cnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjI5OTUsImV4cCI6MjA2NDE5ODk5NX0.A6I2w65qoNg_rc5ytvGp0gO4rRY56YcAQRCepnHI4yg'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anonymous Key')
}

console.log('Initializing Supabase client...')

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null
        return window.sessionStorage.getItem(key)
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return
        window.sessionStorage.setItem(key, value)
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return
        window.sessionStorage.removeItem(key)
      },
    },
  },
  global: {
    headers: {
      'x-application-name': 'cafe-management'
    }
  },
  realtime: {
    timeout: 5000,
    params: {
      eventsPerSecond: 1
    }
  },
  db: {
    schema: 'public'
  }
})

// Clear any existing sessions on initialization
if (typeof window !== 'undefined') {
  window.sessionStorage.removeItem('supabase.auth.token')
}

// Test the connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth state changed:', event, session ? 'Has session' : 'No session')
})

console.log('Supabase client initialized successfully')

export { supabase } 