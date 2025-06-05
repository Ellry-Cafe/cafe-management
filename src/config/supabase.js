import * as supabaseClient from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Debug environment variables (without exposing actual keys)
console.log('Checking Supabase environment variables:', {
  url: !!supabaseUrl,
  anonKey: !!supabaseAnonKey,
  serviceKey: !!supabaseServiceKey,
  urlLength: supabaseUrl?.length,
  anonKeyLength: supabaseAnonKey?.length,
  serviceKeyLength: supabaseServiceKey?.length
})

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey,
    serviceKey: !!supabaseServiceKey
  })
  throw new Error('Missing required environment variables')
}

console.log('Initializing Supabase clients...')

// Regular client for normal operations
const supabase = supabaseClient.createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window?.localStorage,
    storageKey: 'cafe-management-auth',
    debug: import.meta.env.DEV
  },
  global: {
    headers: { 'x-application-name': 'cafe-management' }
  }
})

// Admin client for privileged operations
const supabaseAdmin = supabaseClient.createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Don't persist admin sessions
    storage: undefined, // Don't store admin credentials
  },
  global: {
    headers: { 'x-application-name': 'cafe-management-admin' }
  }
})

// Test the connection immediately
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    const { error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message)
      return false
    }
    
    // Also test admin client
    const { error: adminError } = await supabaseAdmin.auth.getUser()
    if (adminError) {
      console.error('❌ Supabase admin connection test failed:', adminError.message)
      return false
    }
    
    console.log('✅ Supabase connections successful!')
    return true
  } catch (err) {
    console.error('❌ Supabase connection test error:', err.message)
    return false
  }
}

// Test connection on initialization
testConnection().then(isConnected => {
  if (!isConnected) {
    console.warn('⚠️ Initial connection test failed. Please check your environment variables and network connection.')
  }
})

export { supabaseAdmin }
export default supabase 