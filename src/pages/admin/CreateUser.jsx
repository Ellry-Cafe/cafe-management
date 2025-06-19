import { useState } from 'react'
import { UserPlus, User, Mail, Lock, UserCircle, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabaseAdmin } from '../../config/supabase'

const DEPARTMENTS = {
  service: 'Service',
  kitchen: 'Kitchen',
  management: 'Management',
  dining: 'Dining',
  inventory: 'Inventory'
}

function CreateUser({ isOpen, onClose }) {
  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    department: ''
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
      const fullName = `${formData.first_name} ${formData.last_name}`.trim()
      
      console.log('Creating new user:', {
        email: formData.email,
        role: formData.role,
        name: fullName,
        department: formData.department
      })
      
      // Create auth user with metadata using admin client
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          name: fullName,
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          role: formData.role,
          department: formData.department
        }
      })

      if (authError) {
        console.error('Failed to create user:', authError)
        toast.error(authError.message || 'Failed to create user')
        return
      }

      if (!authData.user) {
        throw new Error('No user data received')
      }

      // Update the user's profile with department and name fields
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .update({ 
          department: formData.department,
          first_name: formData.first_name,
          last_name: formData.last_name,
          name: fullName
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Failed to update profile:', profileError)
        toast.error('User created but failed to set profile information')
        return
      }

      console.log('User created successfully:', {
        id: authData.user.id,
        email: authData.user.email,
        role: authData.user.user_metadata.role,
        department: formData.department,
        name: fullName
      })

      toast.success('User created successfully!')
      resetForm()
      onClose() // Close the modal after successful creation

    } catch (error) {
      console.error('Error creating user:', error)
      toast.error(error.message || 'Error creating user')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-orange-600" />
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="John"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Doe"
                  required
                />
              </div>
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
                className="block w-full pl-10 pr-4 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
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
                className="block w-full pl-10 pr-4 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="johndoe"
                required
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
                className="block w-full pl-10 pr-4 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Role and Department Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Role Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-4 pr-10 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="barista">Barista</option>
                <option value="cashier">Cashier</option>
                <option value="cook">Cook</option>
                <option value="assistant_cook">Assistant Cook</option>
                <option value="dining_crew">Dining Crew</option>
                <option value="kitchen_crew">Kitchen Crew</option>
                <option value="inventory_manager">Inventory Manager</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            {/* Department Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="block w-full pl-4 pr-10 py-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select a department</option>
                {Object.entries(DEPARTMENTS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
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
  )
}

export default CreateUser