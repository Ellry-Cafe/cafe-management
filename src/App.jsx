import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { RoleBasedRoute } from './components/RoleBasedRoute'

import { ROLES } from './config/roles'
import ErrorBoundary from './components/ErrorBoundary'

// Layout & Pages
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import Login from './pages/Login'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminLayout />
                </RoleBasedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Redirect to login */}
            <Route path="/" element={<Navigate to="/admin/users" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App


