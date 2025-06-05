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
      // Get role from user metadata instead of querying profiles
      const role = authUser.user_metadata?.role || 'staff'
      const name = authUser.user_metadata?.name || authUser.email
      const username = authUser.user_metadata?.username || authUser.email.split('@')[0]

      // Create user object with role from metadata
      const userWithRole = {
        ...authUser,
        role,
        name,
        username,
        email: authUser.email,
        id: authUser.id
      }

      return userWithRole
    } catch (error) {
      console.error('Error processing user data:', error)
      return null
    }
  }, [])

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event, session) => {
    console.log('Auth state changed:', event, session)
    
    if (event === 'SIGNED_OUT' || !session) {
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
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          return
        }

        if (session?.user && mounted) {
          console.log('Found existing session:', session)
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
      console.log('Attempting sign in for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        throw error
      }

      if (!data.user) {
        throw new Error('No user returned from sign in')
      }

      console.log('Sign in successful:', data.user)
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