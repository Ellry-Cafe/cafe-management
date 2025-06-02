import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export function AdminLayout({ children }) {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
        
        <nav className="mt-6">
          <Link
            to="/admin"
            className="flex items-center px-4 py-2 text-indigo-600 hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Users
          </Link>
          <Link
            to="/admin/menu"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Menu
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Orders
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Header */}
        <header className="bg-white border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <div></div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
} 