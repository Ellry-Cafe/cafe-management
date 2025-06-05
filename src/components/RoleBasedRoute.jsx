import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { DEFAULT_ROUTE } from '../config/roles'

export function RoleBasedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  
  console.log('RoleBasedRoute - Current user:', {
    user: user?.email,
    role: user?.role,
    allowedRoles,
    loading
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // If no user, redirect to login
  if (!user) {
    console.log('No user found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // Check if user's role is allowed
  const hasAllowedRole = allowedRoles.includes(user.role)
  console.log('Role check:', {
    userRole: user.role,
    allowedRoles,
    hasAccess: hasAllowedRole
  })
  
  if (!hasAllowedRole) {
    // Redirect to default route based on their role
    const defaultRoute = DEFAULT_ROUTE[user.role]
    console.log('User does not have allowed role, redirecting to:', defaultRoute)
    return <Navigate to={defaultRoute} replace />
  }

  return children
} 