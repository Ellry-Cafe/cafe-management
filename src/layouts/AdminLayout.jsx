import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useState } from 'react'
import logo from '../assets/logo-cm.png'
import { LayoutDashboard, Users, UserCog, Receipt, Package, Calendar, Home, Clock } from 'lucide-react'
import { Outlet } from 'react-router-dom'

// Custom Peso Receipt Icon
const PesoReceipt = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 2v20h16V2H4z" />
    <path d="M8 6h8" />
    <path d="M8 10h8" />
    <path d="M8 14h6" />
    <path d="M9 18h4" />
    {/* Peso Symbol */}
    <text x="12" y="13" fontSize="7" strokeWidth="1" textAnchor="middle" fill="currentColor">₱</text>
  </svg>
)

function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="fixed inset-0 flex bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-20 bg-navy text-white flex flex-col">
        {/* Logo - Fixed at top */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-center">
            <img src={logo} alt="logo" className="w-auto h-10" />
          </div>
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="mt-8 px-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="space-y-1">
            <Link
              to="/admin"
              className={`flex flex-col items-center px-2 py-3 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className={`w-6 h-6 mb-2 ${isActive('/admin') ? 'text-amber-500' : 'text-amber-500/70'}`} />
              <span className={`text-xs ${isActive('/admin') ? 'text-amber-500' : 'text-white'}`}>Board</span>
            </Link>

            <Link
              to="/admin/users"
              className={`flex flex-col items-center px-2 py-3 rounded-lg transition-colors ${
                isActive('/admin/users')
                  ? 'bg-orange-400/10 text-orange-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Users className={`w-6 h-6 mb-2 ${isActive('/admin/users') ? 'text-orange-400' : 'text-orange-400/70'}`} />
              <span className={`text-xs ${isActive('/admin/users') ? 'text-orange-400' : 'text-white'}`}>Users</span>
            </Link>

            <Link
              to="/admin/attendance"
              className={`flex flex-col items-center px-2 py-3 rounded-lg transition-colors ${
                isActive('/admin/attendance')
                  ? 'bg-green-400/10 text-green-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Clock className={`w-6 h-6 mb-2 ${isActive('/admin/attendance') ? 'text-green-400' : 'text-green-400/70'}`} />
              <span className={`text-xs ${isActive('/admin/attendance') ? 'text-green-400' : 'text-white'}`}>Attendance</span>
            </Link>

            <Link
              to="/admin/sales"
              className={`flex flex-col items-center px-2 py-3 rounded-lg transition-colors ${
                isActive('/admin/sales')
                  ? 'bg-blue-400/10 text-blue-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <PesoReceipt className={`w-6 h-6 mb-2 ${isActive('/admin/sales') ? 'text-blue-400' : 'text-blue-400/70'}`} />
              <span className={`text-xs ${isActive('/admin/sales') ? 'text-blue-400' : 'text-white'}`}>Sales</span>
            </Link>

            <Link
              to="/admin/inventory"
              className={`flex flex-col items-center px-2 py-3 rounded-lg transition-colors ${
                isActive('/admin/inventory')
                  ? 'bg-purple-400/10 text-purple-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Package className={`w-6 h-6 mb-2 ${isActive('/admin/inventory') ? 'text-purple-400' : 'text-purple-400/70'}`} />
              <span className={`text-xs ${isActive('/admin/inventory') ? 'text-purple-400' : 'text-white'}`}>Inventory</span>
            </Link>

            <Link
              to="/admin/booking"
              className={`flex flex-col items-center px-2 py-3 rounded-lg transition-colors ${
                isActive('/admin/booking')
                  ? 'bg-pink-400/10 text-pink-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Calendar className={`w-6 h-6 mb-2 ${isActive('/admin/booking') ? 'text-pink-400' : 'text-pink-400/70'}`} />
              <span className={`text-xs ${isActive('/admin/booking') ? 'text-pink-400' : 'text-white'}`}>Booking</span>
            </Link>

            <Link
              to="/admin/boarding-house"
              className={`flex flex-col items-center px-2 py-3 rounded-lg transition-colors ${
                isActive('/admin/boarding-house')
                  ? 'bg-yellow-400/10 text-yellow-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Home className={`w-6 h-6 mb-2 ${isActive('/admin/boarding-house') ? 'text-yellow-400' : 'text-yellow-400/70'}`} />
              <span className={`text-xs ${isActive('/admin/boarding-house') ? 'text-yellow-400' : 'text-white'}`}>Boarding House</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-navy-dark  border-b h-16">
          <div className="flex justify-between items-center px-6">
            <div></div>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 focus:outline-none bg-orange px-5 py-2 w-72 h-16 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white ">{user?.email}</span>
                <svg
                  className={`w-4 h-4 text-white transition-transform duration-500 ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 w-72 bg-white shadow-lg py-2 px-2 z-10 transition-all duration-500 ease-in-out transform origin-top-right">
                  <Link
                    to="/admin/profile"
                    className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-gray-100 font-normal flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-gray-100 font-normal flex items-center cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        {/* <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {children}
        </main> */}
        <main className="flex-1 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 
export default AdminLayout;