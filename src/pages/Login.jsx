import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DEFAULT_ROUTE } from '../config/roles'
import useAuth from '../hooks/useAuth'
import { Toaster } from 'react-hot-toast'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Log current user state
  useEffect(() => {
    if (user) {
      console.log('🔐 Current user state in Login:', {
        email: user.email,
        role: user.role,
        id: user.id,
        timestamp: new Date().toISOString()
      })
    }
  }, [user])

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user?.role) {
      // Get the intended path from location state
      const intendedPath = location.state?.from?.pathname
      const defaultPath = DEFAULT_ROUTE[user.role]

      console.log('🚀 Login redirect:', {
        role: user.role,
        intendedPath,
        defaultPath,
        timestamp: new Date().toISOString()
      })

      // First try to use the intended path, then fallback to the default route
      const redirectPath = intendedPath || defaultPath
      if (redirectPath) {
        console.log('➡️ Redirecting to:', redirectPath)
        navigate(redirectPath, { replace: true })
      }
    }
  }, [user, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('🔑 Attempting login for:', formData.email)
      
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password')
      }

      await signIn(formData.email, formData.password)
      // The useEffect above will handle the redirect
    } catch (error) {
      console.error('❌ Login error:', error)
      setError(error.message || 'Failed to sign in. Please check your credentials and try again.')
      setFormData(prev => ({ ...prev, password: '' })) // Clear password on error
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing again
    if (error) setError(null)
  }

  // If user is already logged in, show loading
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-white">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg w-[480px] p-8 shadow-md">
        <h1 className="text-3xl font-bold text-center text-navy mb-6">
          Cafe Management System
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-navy text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-navy text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="text-lg font-bold w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Contact your <span className="font-semibold">administrator</span> for account access
        </div>
      </div>
    </div>
  )
} 

export default Login;