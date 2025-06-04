import { useState, useEffect, useCallback, useRef } from 'react'
import supabase from '../config/supabase'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const authSubscription = useRef(null)

  // Memoize fetchUserWithRole to prevent recreating on every render
  const fetchUserWithRole = useCallback(async (authUser) => {
    if (!authUser?.id) return null
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role, email, name')
        .eq('id', authUser.id)
        .single()

      if (error) throw error
      
      if (!profile?.role) {
        console.error('No role found for user:', authUser.id)
        return null
      }

      // Create user object with role from profile
      const userWithRole = {
        ...authUser,
        role: profile.role, // Use the role directly from the profile
        email: profile.email,
        name: profile.name,
        id: profile.id
      }

      return userWithRole
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }, [])

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      setUser(null)
      setLoading(false)
      return
    }

    if (session?.user) {
      const userWithRole = await fetchUserWithRole(session.user)
      if (!userWithRole) {
        console.error('Failed to fetch user role')
        setUser(null)
      } else {
        setUser(userWithRole)
      }
    } else {
      setUser(null)
    }
    
    setLoading(false)
  }, [fetchUserWithRole])

  useEffect(() => {
    let mounted = true

    // Initialize auth state
    const initialize = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && mounted) {
          const userWithRole = await fetchUserWithRole(session.user)
          if (userWithRole) {
            setUser(userWithRole)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }

      // Setup auth state change listener
      if (mounted) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)
        authSubscription.current = subscription
      }
    }

    initialize()

    return () => {
      mounted = false
      if (authSubscription.current) {
        authSubscription.current.unsubscribe()
      }
    }
  }, [fetchUserWithRole, handleAuthChange])

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Auth state change listener will handle updating the user state
      return { user: data.user }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // First unsubscribe from the auth listener to prevent race conditions
      if (authSubscription.current) {
        authSubscription.current.unsubscribe()
      }

      // Clear the user state first to prevent any authenticated requests during sign-out
      setUser(null)

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear any cached data
      window.sessionStorage.clear()
      
      // Reset loading state
      setLoading(false)

      // Re-initialize the auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)
      authSubscription.current = subscription

    } catch (error) {
      console.error('Sign out error:', error)
      // Re-initialize the auth listener in case of error
      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)
      authSubscription.current = subscription
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 