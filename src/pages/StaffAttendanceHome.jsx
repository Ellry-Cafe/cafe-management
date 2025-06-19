import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import attendanceAPI from '../api/attendance'
import supabase from '../config/supabase'
import { Home as HomeIcon, FileText } from 'lucide-react'

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
  if (!hours) return '--'
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

  const fetchAttendance = async (userId) => {
    const dateRange = getTodayDateRange()
    console.log('Fetching attendance with date range:', {
      start: dateRange.start,
      end: dateRange.end,
      userId
    })

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

    console.log('Fetched attendance records:', attData)
    return attData || []
  }

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
        const attData = await fetchAttendance(userData.id)
        setAttendance(attData)
      } catch (err) {
        console.error('Error in fetchData:', err)
        setError('Error loading attendance.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [idNumber, navigate])

  // Find current active record (not clocked out)
  const currentActive = attendance.find(a => a.status === 'active')

  // Calculate total duration
  const totalHours = attendance.reduce((sum, a) => sum + (a.total_hours || 0), 0)

  const handleClock = async (type) => {
    if (!user) return
    setActionLoading(true)
    setError('')
    
    try {
      let result
      if (type === 'clockin') {
        result = await attendanceAPI.clockIn(user.id)
      } else {
        result = await attendanceAPI.clockOut(user.id)
      }

      if (result.success) {
        // Refresh attendance
        const attData = await fetchAttendance(user.id)
        setAttendance(attData)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  const today = new Date()

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col items-center pb-24">
        <div className="w-full">
          <div className="bg-blue-700 text-white text-center py-4 text-xl font-bold w-full">Cafe Attendance</div>
          <div className="bg-white p-6 w-full">
            <div className="mb-2 text-lg font-semibold">Good morning, {user.name}!</div>
            <div className="mb-4 text-gray-500 text-sm">{formatDate(today)}</div>
            <div className="mb-6 border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Today</span>
                <span className="text-gray-500 text-sm">Clock In: {currentActive ? formatTime(currentActive.clock_in) : '--/--'}</span>
                <span className="text-gray-500 text-sm">Clock Out: {currentActive && currentActive.clock_out ? formatTime(currentActive.clock_out) : '--/--'}</span>
              </div>
              <button
                onClick={() => handleClock(currentActive ? 'clockout' : 'clockin')}
                disabled={actionLoading}
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
                    ? 'Clock Out'
                    : 'Clock In'}
              </button>
            </div>
            <div className="mb-4">
              <div className="font-medium mb-2">Today</div>
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
            <HomeIcon className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Home</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/request?id_number=${encodeURIComponent(idNumber)}`)}
          >
            <FileText className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Request</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default StaffAttendanceHome 