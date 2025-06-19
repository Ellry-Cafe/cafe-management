import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthProvider'
import attendanceAPI from '../api/attendance'
import supabase from '../config/supabase'
import { Clock, LogIn, LogOut, Users, Calendar, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const StaffAttendance = () => {
  const { user } = useAuth()
  const [currentStatus, setCurrentStatus] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [activeStaff, setActiveStaff] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState('personal') // 'personal' or 'admin'
  const [filterUserId, setFilterUserId] = useState('')
  const [allUsers, setAllUsers] = useState([])
  const [editingRecord, setEditingRecord] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Check if user is admin
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    fetchCurrentStatus()
    fetchAttendanceHistory()
    if (isAdmin) {
      fetchActiveStaff()
      fetchAllUsers()
    }
  }, [user?.id, selectedDate, viewMode, filterUserId])

  const fetchCurrentStatus = async () => {
    if (!user?.id) return
    
    setLoading(true)
    const result = await attendanceAPI.getCurrentStatus(user.id)
    setLoading(false)
    
    if (result.success) {
      setCurrentStatus(result.data)
    } else {
      console.error('Failed to fetch current status:', result.error)
    }
  }

  const fetchAttendanceHistory = async () => {
    if (!user?.id) return
    
    setLoading(true)
    const startDate = new Date(selectedDate)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(selectedDate)
    endDate.setHours(23, 59, 59, 999)
    
    const result = await attendanceAPI.getAttendanceHistory(
      user.id,
      startDate.toISOString(),
      endDate.toISOString()
    )
    setLoading(false)
    
    if (result.success) {
      setAttendanceHistory(result.data)
    } else {
      console.error('Failed to fetch attendance history:', result.error)
    }
  }

  const fetchActiveStaff = async () => {
    if (!isAdmin) return
    
    setLoading(true)
    const result = await attendanceAPI.getActiveStaff()
    setLoading(false)
    
    if (result.success) {
      setActiveStaff(result.data)
    } else {
      console.error('Failed to fetch active staff:', result.error)
    }
  }

  const fetchAllUsers = async () => {
    if (!isAdmin) return
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .order('name')
      
      if (error) throw error
      setAllUsers(data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleClockIn = async () => {
    if (!user?.id) return
    
    setActionLoading(true)
    const result = await attendanceAPI.clockIn(user.id)
    setActionLoading(false)
    
    if (result.success) {
      toast.success('Successfully clocked in!')
      setCurrentStatus(result.data)
      fetchAttendanceHistory()
      if (isAdmin) fetchActiveStaff()
    } else {
      toast.error(`Clock in failed: ${result.error}`)
    }
  }

  const handleClockOut = async () => {
    if (!user?.id) return
    
    setActionLoading(true)
    const result = await attendanceAPI.clockOut(user.id)
    setActionLoading(false)
    
    if (result.success) {
      toast.success('Successfully clocked out!')
      setCurrentStatus(null)
      fetchAttendanceHistory()
      if (isAdmin) fetchActiveStaff()
    } else {
      toast.error(`Clock out failed: ${result.error}`)
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDuration = (hours) => {
    if (!hours) return '0h 0m'
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const handleEditRecord = (record) => {
    setEditingRecord(record)
    setEditForm({
      clock_in: record.clock_in ? new Date(record.clock_in).toISOString().slice(0, 16) : '',
      clock_out: record.clock_out ? new Date(record.clock_out).toISOString().slice(0, 16) : '',
      location: record.location || '',
      notes: record.notes || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingRecord) return
    
    setActionLoading(true)
    const updates = {
      ...editForm,
      clock_in: editForm.clock_in ? new Date(editForm.clock_in).toISOString() : null,
      clock_out: editForm.clock_out ? new Date(editForm.clock_out).toISOString() : null
    }
    
    const result = await attendanceAPI.updateAttendance(editingRecord.id, updates)
    setActionLoading(false)
    
    if (result.success) {
      toast.success('Attendance record updated successfully!')
      setEditingRecord(null)
      setEditForm({})
      fetchAttendanceHistory()
      if (isAdmin) fetchActiveStaff()
    } else {
      toast.error(`Update failed: ${result.error}`)
    }
  }

  const handleDeleteRecord = async (recordId) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return
    
    setActionLoading(true)
    const result = await attendanceAPI.deleteAttendance(recordId)
    setActionLoading(false)
    
    if (result.success) {
      toast.success('Attendance record deleted successfully!')
      fetchAttendanceHistory()
      if (isAdmin) fetchActiveStaff()
    } else {
      toast.error(`Delete failed: ${result.error}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Attendance</h1>
        <p className="text-gray-600">Manage staff clock-in/out and view attendance records</p>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
          </div>
          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('personal')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'personal'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setViewMode('admin')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin View
              </button>
            </div>
          )}
        </div>

        {viewMode === 'personal' ? (
          <div className="mt-4">
            {currentStatus ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-medium">Currently Clocked In</p>
                    <p className="text-green-600 text-sm">
                      Since: {formatTime(currentStatus.clock_in)} on {formatDate(currentStatus.clock_in)}
                    </p>
                    {currentStatus.location && (
                      <p className="text-green-600 text-sm">Location: {currentStatus.location}</p>
                    )}
                  </div>
                  <button
                    onClick={handleClockOut}
                    disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{actionLoading ? 'Processing...' : 'Clock Out'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">Not Clocked In</p>
                    <p className="text-gray-600 text-sm">Ready to start your shift</p>
                  </div>
                  <button
                    onClick={handleClockIn}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{actionLoading ? 'Processing...' : 'Clock In'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Currently Active Staff</h3>
            {activeStaff.length > 0 ? (
              <div className="grid gap-3">
                {activeStaff.map((record) => (
                  <div key={record.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-800 font-medium">{record.users?.name}</p>
                        <p className="text-blue-600 text-sm">{record.users?.role}</p>
                        <p className="text-blue-600 text-sm">
                          Since: {formatTime(record.clock_in)} on {formatDate(record.clock_in)}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No staff currently clocked in</p>
            )}
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Attendance History</h2>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
            {isAdmin && viewMode === 'admin' && (
              <select
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="">All Staff</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading attendance records...</p>
          </div>
        ) : attendanceHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.users?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">{record.users?.role || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clock_in ? formatTime(record.clock_in) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clock_out ? formatTime(record.clock_out) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.total_hours ? formatDuration(record.total_hours) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRecord(record)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No attendance records found for this date</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Attendance Record</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clock In
                </label>
                <input
                  type="datetime-local"
                  value={editForm.clock_in}
                  onChange={(e) => setEditForm({ ...editForm, clock_in: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clock Out
                </label>
                <input
                  type="datetime-local"
                  value={editForm.clock_out}
                  onChange={(e) => setEditForm({ ...editForm, clock_out: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600"
                  placeholder="Optional location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingRecord(null)
                  setEditForm({})
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffAttendance 