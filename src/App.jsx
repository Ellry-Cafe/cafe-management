import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { RoleBasedRoute } from './components/RoleBasedRoute'
import { AdminDashboard } from './pages/admin/Dashboard'
import { Login } from './pages/Login'
import { ROLES } from './config/roles'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
