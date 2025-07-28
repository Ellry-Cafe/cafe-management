import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, History, Wallet, CalendarX, Clock, CalendarDays, LogOut } from 'lucide-react'
import supabase from '../config/supabase'

function getQueryParam(name, search) {
  const params = new URLSearchParams(search)
  return params.get(name)
}

const TABS = [
  { key: 'cash_advance', label: 'Cash Advance' },
  { key: 'absence', label: 'Absence' },
  { key: 'overtime', label: 'Overtime' },
]

const inputClass = "w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-600"
const textareaClass = "w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-600"

// Formatting functions
function formatDate(dateString) {
  if (!dateString) return '--/--';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const StatusBadge = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full capitalize';
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const StaffAttendanceRequest = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const idNumber = getQueryParam('id_number', location.search)

  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('cash_advance')
  const [amount, setAmount] = useState('')
  const [cashAdvanceDate, setCashAdvanceDate] = useState('')
  const [absenceDate, setAbsenceDate] = useState('')
  const [absenceReason, setAbsenceReason] = useState('')
  const [overtimeDate, setOvertimeDate] = useState('')
  const [overtimeStartTime, setOvertimeStartTime] = useState('')
  const [overtimeEndTime, setOvertimeEndTime] = useState('')
  const [overtimeReason, setOvertimeReason] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!idNumber) {
      navigate('/staff-attendance/login');
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch user by id_number only
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, id_number, name')
          .eq('id_number', idNumber)
          .single();
        
        if (userError || !userData) {
          setError('User not found.');
          setTimeout(() => navigate('/staff-attendance/login'), 1500);
          return;
        }
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [idNumber, navigate]);

  const fetchRequests = useCallback(async (userId) => {
    if (!userId) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setRequests(data)
    } catch (err) {
      console.error("Error fetching requests:", err)
      setMessage('Error fetching requests.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch requests when user is available or tab changes
  useEffect(() => {
    if (user?.id) {
      fetchRequests(user.id)
    }
  }, [user, fetchRequests])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setMessage('User not loaded yet.')
      return
    }
    setLoading(true)
    setMessage('')

    try {
      let requestData = {
        user_id: user.id,
        request_type: tab,
        status: 'pending',
      }
      
      if (tab === 'cash_advance') {
        requestData.amount = parseFloat(amount)
        requestData.request_date = cashAdvanceDate || new Date().toISOString().slice(0, 10)
      } else if (tab === 'absence') {
        requestData.request_date = absenceDate
        requestData.reason = absenceReason
      } else if (tab === 'overtime') {
        requestData.request_date = overtimeDate
        requestData.reason = overtimeReason
        
        // Convert time strings to timestamps
        if (overtimeStartTime && overtimeEndTime && overtimeDate) {
          const startDateTime = new Date(`${overtimeDate}T${overtimeStartTime}`)
          const endDateTime = new Date(`${overtimeDate}T${overtimeEndTime}`)
          
          requestData.overtime_in = startDateTime.toISOString()
          requestData.overtime_out = endDateTime.toISOString()
          
          // Calculate duration in hours
          const durationMs = endDateTime.getTime() - startDateTime.getTime()
          requestData.duration = durationMs / (1000 * 60 * 60) // Convert to hours
        }
      }

      const { error } = await supabase.from('requests').insert([requestData])
      if (error) throw error

      setMessage('Request submitted successfully!')
      
      // Reset form
      setAmount('')
      setCashAdvanceDate('')
      setAbsenceDate('')
      setAbsenceReason('')
      setOvertimeDate('')
      setOvertimeStartTime('')
      setOvertimeEndTime('')
      setOvertimeReason('')

      fetchRequests(user.id) // Refresh list
    } catch (err) {
      console.error('Submission error:', err)
      setMessage(`Failed to submit request: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col items-center pb-24 overflow-y-auto">
        <div className="w-full">
          <div className="bg-blue-700 text-white text-center py-4 text-xl font-bold w-full">Request</div>
          <div className="p-6 bg-white w-full">
            <div className="flex mb-4 border-b">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`flex-1 py-2 font-semibold text-sm border-b-2 transition-colors ${tab === t.key ? 'border-blue-700 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500'}`}
                  onClick={() => { setTab(t.key); setMessage('') }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {error && <div className="text-red-600 text-center font-medium mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {tab === 'cash_advance' && (
                <>
                  <label className="block text-gray-700 font-medium">Amount (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className={inputClass}
                    placeholder="Enter amount"
                    required
                  />
                  <label className="block text-gray-700 font-medium mt-2">Date</label>
                  <input
                    type="date"
                    value={cashAdvanceDate}
                    onChange={e => setCashAdvanceDate(e.target.value)}
                    className={inputClass}
                  />
                </>
              )}
              {tab === 'absence' && (
                <>
                  <label className="block text-gray-700 font-medium">Date</label>
                  <input
                    type="date"
                    value={absenceDate}
                    onChange={e => setAbsenceDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <label className="block text-gray-700 font-medium mt-2">Reason</label>
                  <textarea
                    value={absenceReason}
                    onChange={e => setAbsenceReason(e.target.value)}
                    className={textareaClass}
                    placeholder="Enter reason"
                    required
                  />
                </>
              )}
              {tab === 'overtime' && (
                <>
                  <label className="block text-gray-700 font-medium">Date</label>
                  <input
                    type="date"
                    value={overtimeDate}
                    onChange={e => setOvertimeDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mt-2">Start Time</label>
                      <input
                        type="time"
                        value={overtimeStartTime}
                        onChange={e => setOvertimeStartTime(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mt-2">End Time</label>
                      <input
                        type="time"
                        value={overtimeEndTime}
                        onChange={e => setOvertimeEndTime(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <label className="block text-gray-700 font-medium mt-2">Reason</label>
                  <textarea
                    value={overtimeReason}
                    onChange={e => setOvertimeReason(e.target.value)}
                    className={textareaClass}
                    placeholder="Enter reason for overtime"
                    required
                  />
                </>
              )}
              <button
                type="submit"
                disabled={loading || !user || !!error}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md disabled:bg-blue-300 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              {message && <div className={`text-center font-medium mt-2 ${message.startsWith('Failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</div>}
            </form>
            
            {/* Requests Table */}
            <div className="p-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Request History</h3>
              <div className="border rounded-lg bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left font-semibold">Date</th>
                      <th className="p-2 text-left font-semibold">Type</th>
                      <th className="p-2 text-left font-semibold">Amount</th>
                      <th className="p-2 text-left font-semibold">OT</th>
                      <th className="p-2 text-left font-semibold">Reason</th>
                      <th className="p-2 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="p-4 text-center text-gray-400">Loading...</td></tr>
                    ) : requests.length === 0 ? (
                      <tr><td colSpan="6" className="p-4 text-center text-gray-400">No requests found.</td></tr>
                    ) : (
                      requests.map(req => (
                        <tr key={req.id} className="border-b last:border-b-0">
                          <td className="p-2">{formatDate(req.request_date)}</td>
                          <td className="p-2 capitalize">{req.request_type.replace('_', ' ')}</td>
                          <td className="p-2">
                            {req.amount ? `₱${parseFloat(req.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                          </td>
                          <td className="p-2">
                            {req.duration ? `${req.duration.toFixed(1)}h` : ''}
                          </td>
                          <td className="p-2">{req.reason || ''}</td>
                          <td className="p-2"><StatusBadge status={req.status} /></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <div className="w-full flex justify-around items-center py-2">
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/home?id_number=${encodeURIComponent(idNumber)}`)}
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
            disabled
          >
            <Wallet className="w-7 h-7 mx-auto" />
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
    </div>
  )
}

export default StaffAttendanceRequest; 