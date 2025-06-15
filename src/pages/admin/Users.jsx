import { useState, useEffect } from 'react'
import { 
  UserPlus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  ShieldAlert,
  FileText,
  FileCheck,
  FileX
} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { supabaseAdmin } from '../../config/supabase'
import CreateUser from './CreateUser'
import EditUser from './EditUser'
import PageHeader from '../../components/PageHeader'
import ConfirmModal from '../../components/ConfirmModal'

const ROLE_STYLES = {
  admin: 'bg-purple-100 text-purple-800',
  staff: 'bg-blue-100 text-blue-800',
  cashier: 'bg-green-100 text-green-800',
  manager: 'bg-orange-100 text-orange-800',
  barista: 'bg-pink-100 text-pink-800',
  cook: 'bg-yellow-100 text-yellow-800',
  assistant_cook: 'bg-amber-100 text-amber-800',
  dining_crew: 'bg-teal-100 text-teal-800',
  kitchen_crew: 'bg-cyan-100 text-cyan-800',
  inventory_manager: 'bg-indigo-100 text-indigo-800',
  supervisor: 'bg-rose-100 text-rose-800'
}

const DEPARTMENTS = {
  service: 'Service',
  kitchen: 'Kitchen',
  management: 'Management',
  dining: 'Dining',
  inventory: 'Inventory'
}

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  
  const PAGE_SIZE = 10

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      let query = supabaseAdmin
        .from('users')
        .select(`
          *,
          user_files (
            id,
            file_id,
            is_active,
            files (
              file_type,
              file_name
            )
          )
        `, { count: 'exact' })
      
      // Apply pagination
      const from = (currentPage - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)
      
      if (error) throw error

      setUsers(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedUser(null)
    fetchUsers() // Refresh the list after editing
  }

  const getFileStatus = (user) => {
    const requiredFiles = ['profile_photo', 'id_photo', 'resume', 'contract']
    const userFiles = user.user_files || []
    const activeFiles = userFiles.filter(uf => uf.is_active).map(uf => uf.files.file_type)
    
    const missingFiles = requiredFiles.filter(type => !activeFiles.includes(type))
    
    return {
      complete: missingFiles.length === 0,
      missingCount: missingFiles.length,
      missingTypes: missingFiles
    }
  }

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true)
      
      // Delete auth user first
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (authError) throw authError

      // Profile will be deleted automatically by the cascade delete

      toast.success('User deleted successfully')
      setDeleteModalOpen(false)
      setUserToDelete(null)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Toaster position="top-right" />

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const fileStatus = getFileStatus(user)
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{`${user.first_name} ${user.last_name}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${ROLE_STYLES[user.role] || 'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.department ? DEPARTMENTS[user.department] || user.department : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {fileStatus.complete ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FileCheck className="w-4 h-4 mr-1" />
                              Complete
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FileX className="w-4 h-4 mr-1" />
                              {fileStatus.missingCount} missing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center mr-3"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user)
                            setDeleteModalOpen(true)
                          }}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalCount > PAGE_SIZE && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalCount / PAGE_SIZE)))}
              disabled={currentPage === Math.ceil(totalCount / PAGE_SIZE)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{Math.ceil(totalCount / PAGE_SIZE)}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalCount / PAGE_SIZE)))}
                  disabled={currentPage === Math.ceil(totalCount / PAGE_SIZE)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <CreateUser 
        isOpen={createModalOpen} 
        onClose={() => {
          setCreateModalOpen(false)
          fetchUsers()
        }} 
      />

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUser
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <ConfirmModal
          open={deleteModalOpen}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.first_name} ${userToDelete.last_name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => handleDeleteUser(userToDelete.id)}
          onCancel={() => {
            setDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          iconBg="bg-red-500"
        />
      )}
    </div>
  )
}

export default Users 