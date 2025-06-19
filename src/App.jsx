import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { RoleBasedRoute } from './components/RoleBasedRoute'

import { ROLES } from './config/roles'
import ErrorBoundary from './components/ErrorBoundary'

// Layout & Pages
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import StaffAttendance from './pages/StaffAttendance'
import AttendanceKiosk from './pages/AttendanceKiosk'
import StaffAttendanceLogin from './pages/StaffAttendanceLogin'
import StaffAttendanceHome from './pages/StaffAttendanceHome'
import StaffAttendanceRequest from './pages/StaffAttendanceRequest'
import Login from './pages/Login'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/attendance" element={<AttendanceKiosk />} />
            <Route path="/staff-attendance/login" element={<StaffAttendanceLogin />} />
            <Route path="/staff-attendance/home" element={<StaffAttendanceHome />} />
            <Route path="/staff-attendance/request" element={<StaffAttendanceRequest />} />

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
              <Route path="attendance" element={<StaffAttendance />} />
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


