import * as supabaseClient from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Initializing Supabase with URL:', supabaseUrl)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase URL or Anon Key')
}

const supabase = supabaseClient.createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window?.localStorage,
    storageKey: 'cafe-management-auth',
    debug: true // Enable debug logs
  },
  global: {
    headers: { 'x-application-name': 'cafe-management' }
  },
  realtime: {
    params: {
      eventsPerSecond: 1
    }
  }
})

// Test the connection immediately
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (err) {
    console.error('❌ Supabase connection test error:', err.message)
    return false
  }
}

// Monitor auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔑 Auth State Change:', {
    event,
    status: session ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  })
})

// Test connection on initialization
testConnection().then(isConnected => {
  if (!isConnected) {
    console.warn('⚠️ Initial connection test failed. Please check your network connection and Supabase configuration.')
  }
})

export default supabase 