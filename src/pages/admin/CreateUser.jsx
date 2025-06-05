import { useState, useEffect } from 'react'
import { UserPlus, User, Mail, Lock, UserCircle, Pencil, Trash2, X } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import supabase from '../../config/supabase'

function CreateUser() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    role: 'staff'
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) console.error(error)
    else setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        // Update password if provided
        if (formData.password && formData.password.trim() !== '') {
          const { error: passwordError } = await supabase.auth.updateUser({
            password: formData.password.trim()
          })
          if (passwordError) throw passwordError
        }

        // Update profile
        const updateData = {
          name: formData.name.trim(),
          username: formData.username.trim(),
          role: formData.role
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', editingId)

        if (updateError) throw updateError

        toast.success('Profile updated successfully!')
        setEditingId(null)
      } else {
        // Create user account and profile
        const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            name: formData.name,
            username: formData.username,
            role: formData.role
          }
        })

        if (signUpError) throw signUpError

        toast.success('User created successfully!')
      }

      fetchUsers()
      setFormData({ email: '', password: '', name: '', username: '', role: 'staff' })
    } catch (err) {
      console.error('Error:', err)
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit User' : 'Create New User'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-black"
            required
          />
        </div>

        {!editingId && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded text-black"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-black"
            required
          >
            <option value="">Select role</option>
            <option value="cashier">Cashier</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
          disabled={loading}
        >
          {editingId ? 'Update User' : 'Create User'}
        </button>
      </form>
    </div>
  )
}

export default CreateUser
