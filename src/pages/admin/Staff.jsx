import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import { UserPlus, Clock, Calendar, DollarSign, ClipboardList, FileText, AlertCircle } from 'lucide-react'
import supabase from '../../config/supabase'
import { toast, Toaster } from 'react-hot-toast'

function Staff() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [staffData, setStaffData] = useState({
    dining: [],
    kitchen: []
  })
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState('profiles')

  useEffect(() => {
    fetchStaffData()
    fetchRequests()
  }, [])

  const fetchStaffData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['staff', 'kitchen'])

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        throw new Error('Failed to load staff data')
      }

      const dining = profiles?.filter(staff => staff.department === 'dining') || []
      const kitchen = profiles?.filter(staff => staff.department === 'kitchen') || []

      console.log('Fetched staff data:', { dining, kitchen })
      setStaffData({ dining, kitchen })
    } catch (err) {
      console.error('Error in fetchStaffData:', err)
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (requestsError) {
        console.error('Error fetching requests:', requestsError)
        throw new Error('Failed to load requests')
      }

      console.log('Fetched requests:', requests)
      setRequests(requests || [])
    } catch (err) {
      console.error('Error in fetchRequests:', err)
      toast.error('Failed to load requests')
      setRequests([])
    }
  }

  const navigation = (
    <>
      <a
        href="#profiles"
        onClick={() => setActiveTab('profiles')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'profiles' 
            ? 'text-amber-600 border-b-2 border-amber-500' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Profiles
      </a>
      <a
        href="#attendance"
        onClick={() => setActiveTab('attendance')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'attendance'
            ? 'text-amber-600 border-b-2 border-amber-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Attendance Tracking
      </a>
      <a
        href="#payroll"
        onClick={() => setActiveTab('payroll')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'payroll'
            ? 'text-amber-600 border-b-2 border-amber-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Payroll
      </a>
      <a
        href="#shifts"
        onClick={() => setActiveTab('shifts')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'shifts'
            ? 'text-amber-600 border-b-2 border-amber-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Shifts
      </a>
      <a
        href="#requests"
        onClick={() => setActiveTab('requests')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'requests'
            ? 'text-amber-600 border-b-2 border-amber-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Request
      </a>
      <a
        href="#reports"
        onClick={() => setActiveTab('reports')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === 'reports'
            ? 'text-amber-600 border-b-2 border-amber-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Reports
      </a>
    </>
  )

  if (error) {
    return (
      <div>
        <PageHeader 
          title="Staff Management"
          navigation={navigation}
        >
          <button className="flex items-center px-4 py-2 bg-amber-400 text-gray-800 rounded-lg hover:bg-amber-500 transition-colors">
            <UserPlus className="w-5 h-5 mr-2" />
            Add Staff
          </button>
        </PageHeader>

        <div className="px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />
      <PageHeader 
        title="Staff Management"
        navigation={navigation}
      >
        <button className="flex items-center px-4 py-2 bg-amber-400 text-gray-800 rounded-lg hover:bg-amber-500 transition-colors">
          <UserPlus className="w-5 h-5 mr-2" />
          Add Staff
        </button>
      </PageHeader>

      <div className="px-8 py-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* On-Duty Today Card */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">On-Duty Today</h2>
                
                {/* Dining Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Dining</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="text-sm font-medium text-gray-500 pb-2">Time</th>
                        <th className="text-sm font-medium text-gray-500 pb-2">Name</th>
                        <th className="text-sm font-medium text-gray-500 pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {staffData.dining.map((staff) => (
                        <tr key={staff.id}>
                          <td className="py-2">{staff.shift_time}</td>
                          <td>{staff.name}</td>
                          <td>
                            <span className={
                              staff.status === 'out' ? 'text-red-600' : 
                              staff.status === 'in' ? 'text-green-600' : 
                              'text-gray-500'
                            }>
                              {staff.status ? staff.status.charAt(0).toUpperCase() + staff.status.slice(1) : ''}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {staffData.dining.length === 0 && (
                        <tr>
                          <td colSpan="3" className="py-4 text-center text-gray-500">
                            No dining staff found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Kitchen Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Kitchen</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="text-sm font-medium text-gray-500 pb-2">Time</th>
                        <th className="text-sm font-medium text-gray-500 pb-2">Name</th>
                        <th className="text-sm font-medium text-gray-500 pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {staffData.kitchen.map((staff) => (
                        <tr key={staff.id}>
                          <td className="py-2">{staff.shift_time}</td>
                          <td>{staff.name}</td>
                          <td>
                            <span className={
                              staff.status === 'out' ? 'text-red-600' : 
                              staff.status === 'in' ? 'text-green-600' : 
                              'text-gray-500'
                            }>
                              {staff.status ? staff.status.charAt(0).toUpperCase() + staff.status.slice(1) : ''}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {staffData.kitchen.length === 0 && (
                        <tr>
                          <td colSpan="3" className="py-4 text-center text-gray-500">
                            No kitchen staff found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Request Today Card */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Request Today</h2>
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {requests.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium">{request.type}</h3>
                        <p className="text-sm text-gray-500">
                          {request.staff_name} - {request.type === 'Cash Advance' ? `₱${request.amount}` : request.details}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${
                        request.status === 'pending' ? 'text-amber-600' : 
                        request.status === 'approved' ? 'text-green-600' : 
                        'text-red-600'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No requests for today
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Staff 