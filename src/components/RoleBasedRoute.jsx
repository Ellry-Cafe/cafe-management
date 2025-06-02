import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { ROLE_ROUTES } from '../config/roles'

export function RoleBasedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user's role is allowed
  const hasAllowedRole = allowedRoles.includes(user.role)
  
  if (!hasAllowedRole) {
    // Redirect to default route based on their role
    const defaultRoute = ROLE_ROUTES[user.role]?.[0] || '/login'
    return <Navigate to={defaultRoute} replace />
  }

  return children
} 