import { useState } from 'react'
import { supabase } from './config/supabase'

function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      // Get user's profile including role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      console.log('Logged in user profile:', profile)
      // TODO: Redirect based on role (e.g., admin to dashboard, staff to their interface)
      
    } catch (error) {
      setError(error.message)
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
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg w-[480px] p-8">
        <h1 className="text-[30px] font-bold text-center text-gray-800 mb-6">
          Cafe Management System
        </h1>
        
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Contact your administrator for account access
        </div>
      </div>
    </div>
  )
}

export default App
