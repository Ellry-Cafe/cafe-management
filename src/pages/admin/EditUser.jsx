import { useState, useEffect } from 'react'
import { UserPlus, User, Mail, Lock, UserCircle, X, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabaseAdmin } from '../../config/supabase'

function EditUser({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Load user data when modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        role: user.role || '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validatePasswords = () => {
    // If both password fields are empty, password update is not requested
    if (!formData.password && !formData.confirmPassword) {
      return true
    }

    // If only one password field is filled
    if ((!formData.password && formData.confirmPassword) || 
        (formData.password && !formData.confirmPassword)) {
      toast.error('Please fill both password fields')
      return false
    }

    // Check password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePasswords()) {
      return
    }

    setLoading(true)

    try {
      console.log('Updating user:', {
        id: user.id,
        ...formData
      })
      
      // Update user data
      const { error: userError } = await supabaseAdmin
        .from('users')
        .update({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          role: formData.role,
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Prepare auth update data
      const authUpdateData = {
        email: formData.email,
        user_metadata: {
          name: formData.name,
          username: formData.username,
          role: formData.role,
        }
      }

      // Add password to update data if provided
      if (formData.password) {
        authUpdateData.password = formData.password
      }

      // Update auth user metadata and optionally password
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        authUpdateData
      )

      if (authError) throw authError

      toast.success('User updated successfully!')
      onClose() // Close the modal after successful update

    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Error updating user')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-orange-600" />
            Edit User: {user.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
                className="block w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
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
                className="block w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

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
                className="block w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="johndoe"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              New Password (Optional)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Leave blank to keep current"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Leave blank to keep current"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
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
              className="block w-full pl-4 pr-10 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">Select a role</option>
              <option value="cashier">Cashier</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating User...
                </>
              ) : (
                'Update User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUser 