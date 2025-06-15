import { useState, useEffect } from 'react'
import { UserPlus, User, Mail, Lock, UserCircle, X, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabaseAdmin } from '../../config/supabase'
import UserFileManager from '../../components/UserFileManager'

const DEPARTMENTS = {
  service: 'Service',
  kitchen: 'Kitchen',
  management: 'Management',
  dining: 'Dining',
  inventory: 'Inventory'
}

function EditUser({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    role: '',
    password: '',
    confirmPassword: '',
    contact_number: '',
    emergency_contact: '',
    birthdate: '',
    present_address: '',
    department: '',
    start_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Load user data when modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
        role: user.role || '',
        password: '',
        confirmPassword: '',
        contact_number: user.contact_number || '',
        emergency_contact: user.emergency_contact || '',
        birthdate: user.birthdate || '',
        present_address: user.present_address || '',
        department: user.department || '',
        start_date: user.start_date || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          username: formData.username,
          role: formData.role,
          contact_number: formData.contact_number,
          emergency_contact: formData.emergency_contact,
          birthdate: formData.birthdate,
          present_address: formData.present_address,
          department: formData.department,
          start_date: formData.start_date,
          name: `${formData.first_name} ${formData.last_name}`.trim()
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Update auth user data if needed
      if (formData.password || formData.email !== user.email) {
        const authUpdateData = {
          email: formData.email,
          user_metadata: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.username,
            role: formData.role,
            department: formData.department
          }
        }

        if (formData.password) {
          authUpdateData.password = formData.password
        }

        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          authUpdateData
        )

        if (authError) throw authError
      }

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
      <div className="relative top-5 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-orange-600" />
            Edit User: {`${user.first_name} ${user.last_name}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Present Address
              </label>
              <input
                type="text"
                name="present_address"
                value={formData.present_address}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                New Password (Optional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Leave blank to keep current"
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
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Leave blank to keep current"
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
          </div>

          {/* Employment Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
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

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select department</option>
                {Object.entries(DEPARTMENTS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* File Management */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">File Management</h3>
            <UserFileManager userId={user.id} />
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