import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabase'

const StaffAttendanceLogin = () => {
  const [idNumber, setIdNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, id_number, name, role')
        .eq('id_number', idNumber)
        .single()
      if (error || !data) {
        setError('User not found. Please check your ID number.')
        setLoading(false)
        return
      }
      // Redirect to home page with id_number as query param
      navigate(`/staff-attendance/home?id_number=${encodeURIComponent(idNumber)}`)
    } catch {
      setError('Error looking up user.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Cafe Attendance</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-gray-700 font-medium mb-1">Enter your ID number:</label>
          <input
            type="text"
            value={idNumber}
            onChange={e => setIdNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-600"
            placeholder="0000000"
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !idNumber}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-center text-red-600 font-medium">{error}</div>
        )}
      </div>
    </div>
  )
}

export default StaffAttendanceLogin 