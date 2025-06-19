import React, { useState } from 'react'
import attendanceAPI from '../api/attendance'
import supabase from '../config/supabase'
import { LogIn, LogOut, CheckCircle, XCircle } from 'lucide-react'

const AttendanceKiosk = () => {
  const [idNumber, setIdNumber] = useState('')
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  // Find user by ID number
  const fetchUser = async (id) => {
    setUser(null)
    setStatus(null)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('id_number', id)
        .single()
      if (error || !data) {
        setUser(null)
        setStatus({ type: 'error', message: 'User not found. Please check your ID number.' })
        return null
      }
      setUser(data)
      return data
    } catch {
      setStatus({ type: 'error', message: 'Error looking up user.' })
      return null
    }
  }

  const handleClock = async (type) => {
    setLoading(true)
    setStatus(null)
    const foundUser = await fetchUser(idNumber)
    if (!foundUser) {
      setLoading(false)
      return
    }
    let result
    if (type === 'clockin') {
      result = await attendanceAPI.clockIn(foundUser.id)
    } else {
      result = await attendanceAPI.clockOut(foundUser.id)
    }
    setLoading(false)
    if (result.success) {
      setStatus({ type: 'success', message: `${type === 'clockin' ? 'Clocked in' : 'Clocked out'} successfully!` })
    } else {
      setStatus({ type: 'error', message: result.error || 'Action failed.' })
    }
  }

  const handleInputChange = (e) => {
    setIdNumber(e.target.value)
    setUser(null)
    setStatus(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Cafe Attendance Kiosk</h1>
        <form
          onSubmit={e => { e.preventDefault(); }}
          className="space-y-4"
        >
          <label className="block text-gray-700 font-medium mb-1">Enter your ID number</label>
          <input
            type="text"
            value={idNumber}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-600"
            placeholder="ID Number"
            autoFocus
            disabled={loading}
          />
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={() => handleClock('clockin')}
              disabled={loading || !idNumber}
              className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md disabled:bg-green-300 transition-colors"
            >
              <LogIn className="h-5 w-5 mr-2" /> Clock In
            </button>
            <button
              type="button"
              onClick={() => handleClock('clockout')}
              disabled={loading || !idNumber}
              className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md disabled:bg-red-300 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" /> Clock Out
            </button>
          </div>
        </form>
        {user && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.role}</p>
          </div>
        )}
        {status && (
          <div className={`mt-6 flex items-center justify-center space-x-2 ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            <span className="font-medium">{status.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceKiosk 