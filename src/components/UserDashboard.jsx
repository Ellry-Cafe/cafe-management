import { useEffect, useState } from 'react';
import { getSchedules } from '../api/schedules';

const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

function getToday() {
  return days[new Date().getDay()];
}

function UserDashboard() {
  const [diningStaff, setDiningStaff] = useState([]);
  const [kitchenStaff, setKitchenStaff] = useState([]);

  useEffect(() => {
    async function fetchOnDuty() {
      const { data } = await getSchedules();
      const today = getToday();
      // Filter for today's shifts
      const todayShifts = (data || []).filter(s => s.day_of_week === today);
      // Group by department
      setDiningStaff(todayShifts.filter(s => (s.department || s.users?.department) === 'dining'));
      setKitchenStaff(todayShifts.filter(s => (s.department || s.users?.department) === 'kitchen'));
    }
    fetchOnDuty();
  }, []);

  const requests = [
    { type: 'Cash Advance', user: 'Marco', amount: '₱1,000', status: 'Pending' },
    { type: 'Cash Advance', user: 'Val', amount: '₱500', status: 'Approved' },
    { type: 'Leave of absence', user: 'Ian', details: 'important matters', status: 'Approved' }
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Dining Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Dining Staff On Duty</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 text-xs">
              <th className="pb-2">Time</th>
              <th className="pb-2">Name</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {diningStaff.map((shift, idx) => (
              <tr key={idx} className="border-t border-gray-100">
                <td className="py-2 text-gray-600">{shift.shift_start} - {shift.shift_end}</td>
                <td className="py-2 text-gray-600">{shift.users ? `${shift.users.first_name} ${shift.users.last_name}` : shift.staff_name}</td>
                <td className="py-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Kitchen Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Kitchen Staff On Duty</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 text-xs">
              <th className="pb-2">Time</th>
              <th className="pb-2">Name</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {kitchenStaff.map((shift, idx) => (
              <tr key={idx} className="border-t border-gray-100">
                <td className="py-2 text-gray-600">{shift.shift_start} - {shift.shift_end}</td>
                <td className="py-2 text-gray-600">{shift.users ? `${shift.users.first_name} ${shift.users.last_name}` : shift.staff_name}</td>
                <td className="py-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request Today Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Request Today</h2>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        <div className="space-y-4">
          {requests.map((request, index) => (
            <div key={index} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800 text-xs">{request.type}</h3>
                  <p className="text-gray-600">
                    {request.user}
                    {request.amount && ` - ${request.amount}`}
                    {request.details && ` - ${request.details}`}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  request.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard 