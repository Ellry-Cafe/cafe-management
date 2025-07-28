import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import attendanceAPI from '../api/attendance'
import supabase from '../config/supabase'
import { Home, FileText, History, CalendarDays, LogOut, X } from 'lucide-react'

function getQueryParam(name, search) {
  const params = new URLSearchParams(search)
  return params.get(name)
}

function formatTime(dateString) {
  if (!dateString) return '--/--'
  const d = new Date(dateString)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDuration(hours) {
  if (hours === null || typeof hours === 'undefined') return '--'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h} hr${h !== 1 ? 's' : ''} ${m} min`
}

// Helper function to get today's date range in UTC
function getTodayDateRange() {
  // Get current date in user's timezone
  const now = new Date()
  
  // Start of today in user's timezone
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // End of today in user's timezone
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)
  
  // Convert to UTC ISO strings
  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString()
  }
}

const StaffAttendanceHome = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const idNumber = getQueryParam('id_number', location.search)

  const [user, setUser] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [today, setToday] = useState(new Date())
  const [showWarningModal, setShowWarningModal] = useState(false)

  const fetchAttendance = useCallback(async (userId) => {
    if (!userId) return;
    const dateRange = getTodayDateRange()
    console.log('Fetching attendance with date range:', {
      start: dateRange.start,
      end: dateRange.end,
      userId
    })

    // Fetch today's attendance records
    const { data: attData, error: attError } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .gte('clock_in', dateRange.start)
      .lt('clock_in', dateRange.end)
      .order('clock_in', { ascending: true })

    if (attError) {
      console.error('Error fetching attendance:', attError)
      throw attError
    }

    // Also fetch any active records from previous days
    const { data: activeData, error: activeError } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lt('clock_in', dateRange.start)
      .order('clock_in', { ascending: false })

    if (activeError) {
      console.error('Error fetching active records:', activeError)
      throw activeError
    }

    // Combine today's records with any active records from previous days
    const combinedData = [...(attData || []), ...(activeData || [])]
    console.log('Fetched attendance records:', combinedData)
    setAttendance(combinedData || [])
  }, [])

  // Fetch user and today's attendance
  useEffect(() => {
    if (!idNumber) {
      navigate('/staff-attendance/login')
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        // Fetch user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, id_number, name, role')
          .eq('id_number', idNumber)
          .single()

        if (userError || !userData) {
          console.error('User fetch error:', userError)
          setError('User not found.')
          setLoading(false)
          setTimeout(() => navigate('/staff-attendance/login'), 1500)
          return
        }

        setUser(userData)
        fetchAttendance(userData.id)
      } catch (err) {
        console.error('Error in fetchData:', err)
        setError('Error loading attendance.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    const timer = setInterval(() => {
      setToday(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [idNumber, navigate, fetchAttendance])

  // Find current active record (not clocked out)
  const currentActive = attendance.find(a => a.status === 'active' || !a.clock_out)
  
  // Check if the active record is from a previous day
  const isActiveFromPreviousDay = currentActive && new Date(currentActive.clock_in).toDateString() !== new Date().toDateString()

  // Debug logging
  console.log('Debug - currentActive:', currentActive)
  console.log('Debug - isActiveFromPreviousDay:', isActiveFromPreviousDay)
  console.log('Debug - showWarningModal:', showWarningModal)

  // Show warning modal when there's an active record from previous day
  useEffect(() => {
    console.log('useEffect triggered - isActiveFromPreviousDay:', isActiveFromPreviousDay, 'showWarningModal:', showWarningModal)
    if (isActiveFromPreviousDay && !showWarningModal) {
      console.log('Setting showWarningModal to true')
      setShowWarningModal(true)
    }
  }, [isActiveFromPreviousDay, showWarningModal])

  // Calculate total duration
  const totalHours = attendance.reduce((sum, a) => sum + (a.total_hours || 0), 0)

  const handleClock = async (type) => {
    if (!user) return
    setActionLoading(true)
    setError('')
    
    try {
      let result
      if (type === 'clockin') {
        if (currentActive && !isActiveFromPreviousDay) {
          setError('Please clock out before clocking in again.')
          setActionLoading(false)
          return
        }
        
        // If there's an active record from previous day, show modal instead of auto-closing
        if (isActiveFromPreviousDay) {
          setShowWarningModal(true)
          setActionLoading(false)
          return
        }
        
        result = await attendanceAPI.clockIn(user.id)
      } else {
        if (!currentActive) {
          setError('No active attendance to clock out.')
          setActionLoading(false)
          return
        }
        result = await attendanceAPI.clockOut(user.id)
      }

      if (result.success) {
        // Refresh attendance
        fetchAttendance(user.id)
      } else {
        setError(result.error || 'Action failed.')
      }
    } catch (err) {
      console.error('Error in handleClock:', err)
      setError('An unexpected error occurred.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleClosePreviousShift = async () => {
    if (!user || !currentActive) return
    setActionLoading(true)
    setShowWarningModal(false)
    
    try {
      // Close the previous shift only
      const closeResult = await attendanceAPI.clockOut(user.id)
      if (!closeResult.success) {
        setError(closeResult.error || 'Failed to close previous shift.')
        setActionLoading(false)
        return
      }
      
      // Refresh attendance to update the UI
      await fetchAttendance(user.id)
      
      // Show success message
      setError('Previous shift closed successfully! You can now clock in during your scheduled hours.')
      setTimeout(() => setError(''), 5000)
      
    } catch (err) {
      console.error('Error closing previous shift:', err)
      setError('An unexpected error occurred.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col items-center pb-24">
        <div className="w-full">
          <div className="bg-blue-700 text-white text-center py-4 text-xl font-bold w-full">Cafe Attendance</div>
          <div className="bg-white p-6 w-full">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-center">
                {error}
              </div>
            )}
            <div className="mb-2 text-lg font-semibold">Good morning, {user?.name}!</div>
            <div className="mb-4 text-gray-500 text-sm">{formatDate(today)}</div>
            <div className="mb-6 border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Today</span>
                <span className="text-gray-500 text-sm">Clock In: {currentActive ? formatTime(currentActive.clock_in) : '--/--'}</span>
                <span className="text-gray-500 text-sm">Clock Out: {currentActive && currentActive.clock_out ? formatTime(currentActive.clock_out) : '--/--'}</span>
              </div>
              <button
                onClick={() => handleClock(currentActive ? 'clockout' : 'clockin')}
                disabled={actionLoading || !user}
                className={`w-full mt-2 py-2 rounded-md font-semibold text-white ${
                  actionLoading
                    ? 'bg-gray-300'
                    : currentActive
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading
                  ? 'Processing...'
                  : currentActive
                    ? isActiveFromPreviousDay ? 'Close Previous Shift' : 'Clock Out'
                    : 'Clock In'}
              </button>
            </div>
            <div className="mb-4">
              <div className="font-medium mb-2">Today's Time Clock</div>
              <div className="border rounded-lg p-2 bg-gray-50">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Clock In</th>
                      <th className="text-left">Clock Out</th>
                      <th className="text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length === 0 && (
                      <tr><td colSpan={3} className="text-center text-gray-400 py-2">No records</td></tr>
                    )}
                    {attendance.map((a, i) => (
                      <tr key={a.id || i}>
                        <td>{formatTime(a.clock_in)}</td>
                        <td>{a.clock_out ? formatTime(a.clock_out) : '--/--'}</td>
                        <td>{a.total_hours ? formatDuration(a.total_hours) : '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2 text-right text-xs text-gray-600">
                  Total duration: {formatDuration(totalHours)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <div className="w-full flex justify-around items-center py-2">
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            disabled
          >
            <Home className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Home</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/history?id_number=${encodeURIComponent(idNumber)}`)}
          >
            <History className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">History</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/schedule?id_number=${encodeURIComponent(idNumber)}`)}
          >
            <CalendarDays className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Schedule</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/request?id_number=${encodeURIComponent(idNumber)}`)}
          >
            <FileText className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Request</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate('/staff-attendance/login')}
          >
            <LogOut className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Logout</span>
          </button>
        </div>
      </nav>
      
      {/* Warning Modal for Previous Day Active Record */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Previous Shift Not Closed</h3>
              <button
                onClick={() => setShowWarningModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">⚠️</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    You have an active attendance record from a previous day that hasn't been closed yet.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Click "Close Previous Shift" to automatically close it using your scheduled end time. You can then clock in during your scheduled hours.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Got it
              </button>
              <button
                onClick={handleClosePreviousShift}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close Previous Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffAttendanceHome 