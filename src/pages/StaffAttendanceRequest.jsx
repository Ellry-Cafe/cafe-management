import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home as HomeIcon, DollarSign, CalendarX, Clock } from 'lucide-react'

function getQueryParam(name, search) {
  const params = new URLSearchParams(search)
  return params.get(name)
}

const TABS = [
  { key: 'cash', label: 'Cash Advance', icon: <DollarSign className="w-5 h-5 mr-1" /> },
  { key: 'absent', label: 'Absence', icon: <CalendarX className="w-5 h-5 mr-1" /> },
  { key: 'overtime', label: 'Overtime', icon: <Clock className="w-5 h-5 mr-1" /> },
]

const inputClass = "w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-600"
const textareaClass = "w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-600"

const StaffAttendanceRequest = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const idNumber = getQueryParam('id_number', location.search)

  const [tab, setTab] = useState('cash')
  const [amount, setAmount] = useState('')
  const [absentDate, setAbsentDate] = useState('')
  const [absentReason, setAbsentReason] = useState('')
  const [otDate, setOtDate] = useState('')
  const [otHours, setOtHours] = useState('')
  const [otReason, setOtReason] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setMessage('Request submitted! (Demo only)')
    }, 1000)
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col items-center pb-24">
        <div className="w-full">
          <div className="bg-blue-700 text-white text-center py-4 text-xl font-bold w-full">Request</div>
          <div className="bg-white p-6 w-full">
            <div className="flex mb-4 border-b">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`flex-1 py-2 flex items-center justify-center font-semibold text-sm border-b-2 transition-colors ${tab === t.key ? 'border-blue-700 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500'}`}
                  onClick={() => { setTab(t.key); setMessage('') }}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {tab === 'cash' && (
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
                </>
              )}
              {tab === 'absent' && (
                <>
                  <label className="block text-gray-700 font-medium">Date</label>
                  <input
                    type="date"
                    value={absentDate}
                    onChange={e => setAbsentDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <label className="block text-gray-700 font-medium mt-2">Reason</label>
                  <textarea
                    value={absentReason}
                    onChange={e => setAbsentReason(e.target.value)}
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
                    value={otDate}
                    onChange={e => setOtDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <label className="block text-gray-700 font-medium mt-2">Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={otHours}
                    onChange={e => setOtHours(e.target.value)}
                    className={inputClass}
                    placeholder="Enter hours"
                    required
                  />
                  <label className="block text-gray-700 font-medium mt-2">Reason</label>
                  <textarea
                    value={otReason}
                    onChange={e => setOtReason(e.target.value)}
                    className={textareaClass}
                    placeholder="Enter reason"
                    required
                  />
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md disabled:bg-blue-300 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              {message && <div className="text-green-700 text-center font-medium mt-2">{message}</div>}
            </form>
            
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
            <HomeIcon className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Home</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            disabled
          >
            <Clock className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Request</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default StaffAttendanceRequest 