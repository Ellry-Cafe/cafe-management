import { createContext, useState, useEffect } from 'react'
import supabase from '../config/supabase'
import { toast } from 'react-hot-toast'

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUserProfile = async (userId) => {
    try {
      console.log('🔍 Loading user profile for:', userId)
      
      // Get profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError)
        return null
      }

      // Get current session to check metadata
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('❌ Session fetch error:', sessionError)
        return null
      }

      const currentRole = session?.user?.user_metadata?.role

      // If role in metadata doesn't match profile, update it
      if (currentRole !== profile.role) {
        console.log('⚠️ Role mismatch detected:', {
          profileRole: profile.role,
          metadataRole: currentRole
        })

        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { role: profile.role }
        })

        if (updateError) {
          console.error('❌ Failed to update user metadata:', updateError)
        } else {
          console.log('✅ Updated user metadata with role:', profile.role)
        }
      }

      return profile
    } catch (error) {
      console.error('❌ Profile load error:', error)
      return null
    }
  }

  const signIn = async (email, password) => {
    try {
      // First sign out to clear any existing session
      await supabase.auth.signOut()
      
      console.log('🔑 Attempting sign in for:', email)
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (!data?.user) {
        throw new Error('No user data received')
      }

      // Force a fresh profile load
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        console.error('❌ Profile fetch error:', profileError)
        throw new Error('Failed to load user profile')
      }

      // Update user metadata with role from profile
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: profile.role }
      })

      if (updateError) {
        console.error('❌ Failed to update user metadata:', updateError)
      }

      // Get fresh session after metadata update
      const { data: { session } } = await supabase.auth.getSession()

      console.log('✅ Sign in successful:', {
        email: profile.email,
        profileRole: profile.role,
        metadataRole: session?.user?.user_metadata?.role
      })

      const userWithProfile = {
        ...session.user,
        ...profile,
        role: profile.role // Ensure role from profile is used
      }

      setUser(userWithProfile)
      toast.success(`Welcome back, ${profile.name || 'User'}!`)

      return { user: userWithProfile }

    } catch (error) {
      console.error('❌ Authentication error:', error)
      await supabase.auth.signOut()
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError)
          return
        }

        if (session?.user) {
          console.log('🔑 Found session for user:', session.user.email)
          const profile = await loadUserProfile(session.user.id)
          
          if (profile) {
            const userWithProfile = {
              ...session.user,
              ...profile,
              role: profile.role // Ensure role from profile is used
            }
            
            console.log('👤 Setting user state:', {
              email: userWithProfile.email,
              role: userWithProfile.role
            })
            
            setUser(userWithProfile)
          } else {
            console.error('❌ No profile found for user')
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', {
        event,
        email: session?.user?.email
      })
      
      if (session?.user) {
        const profile = await loadUserProfile(session.user.id)
        if (profile) {
          const userWithProfile = {
            ...session.user,
            ...profile,
            role: profile.role // Ensure role from profile is used
          }
          
          console.log('👤 Updated user state:', {
            email: userWithProfile.email,
            role: userWithProfile.role
          })
          
          setUser(userWithProfile)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
} 