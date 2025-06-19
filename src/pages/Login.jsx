import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_ROUTE } from '../config/roles'
import useAuth from '../hooks/useAuth'

function Login() {
  const navigate = useNavigate()
  const { signIn, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user?.role && DEFAULT_ROUTE[user.role]) {
      navigate(DEFAULT_ROUTE[user.role])
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signIn(formData.email, formData.password)
      // The auth state change listener will handle the redirect
    } catch (error) {
      console.error('Login error:', error.message)
      setError(error.message || 'An error occurred during sign in')
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="bg-white rounded-lg w-[480px] p-8 shadow-md">
        <h1 className="text-3xl font-bold text-center text-navy mb-6">
          Cafe Management System
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="text-sm text-red-500 bg-red-100 border border-red-600 p-2 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block text-navy text-sm font-normal mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-sm bg-gray-50 text-gray-600 focus:bg-white focus:ring-1 focus:ring-black focus:outline-none disabled:opacity-50 border border-gray-300"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-navy text-sm font-normal mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-sm bg-gray-50 text-gray-600 focus:bg-white focus:ring-1 focus:ring-black focus:outline-none disabled:opacity-50 border border-gray-300"
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-navy">
          Contact your <b>administrator</b> for account access
        </div>
      </div>
    </div>
  )
} 
export default Login;