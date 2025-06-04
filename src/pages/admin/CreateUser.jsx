import { useState } from 'react'
import { UserPlus, User, Mail, Lock, UserCircle } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import supabase from '../../config/supabase'


function CreateUser() {
  const initialFormState = {
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
  }
  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Starting user creation with data:', formData)
      
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            username: formData.username,
            role: formData.role,
          },
        },
      })

      if (authError) {
        console.error('Auth Error:', authError)
        toast.error(authError.message)
        setLoading(false)
        return
      }

      console.log('Auth user created:', authData)

      if (!authData.user?.id) {
        toast.error('Failed to create user account')
        setLoading(false)
        return
      }

      // Then, update or create the profile
      console.log('Updating profile for user:', authData.user.id)
      
      // Match exact table structure from Supabase
      const profileData = {
        id: authData.user.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        username: formData.username,
        password: formData.password,
        created_at: new Date().toISOString()
      }
      
      console.log('Profile data to upsert:', profileData)

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id',
          returning: 'minimal'
        })

      if (profileError) {
        console.error('Profile Error:', profileError)
        toast.error(profileError.message)
        setLoading(false)
        return
      }

      console.log('Profile updated successfully')
      toast.success('User created successfully!')
      resetForm()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error(error.message || 'Error creating user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-orange-600" />
            Create New User
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a new user to the system with their role and permissions.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 text-gray-800 bg-slate-200 border-0 rounded-lg focus:ring-1 focus:ring-gray-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 text-gray-800 bg-slate-200 border-0 rounded-lg focus:ring-1 focus:ring-gray-200"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Username and Password Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 text-gray-800 bg-slate-200 border-0 rounded-lg focus:ring-1 focus:ring-gray-200"
                      placeholder="johndoe"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 text-gray-800 bg-slate-200 border-0 rounded-lg focus:ring-1 focus:ring-gray-200"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-10 py-2.5 text-gray-800 bg-slate-200 border-0 rounded-lg focus:ring-1 focus:ring-gray-200"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="cashier">Cashier</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create User Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Need help? Contact the system administrator for assistance.
        </p>
      </div>
    </div>
  )
}

export default CreateUser;