function UserDashboard() {
  const diningStaff = [
    { time: '8:00 am - 5:30 pm', name: 'Allia', status: 'Out' },
    { time: '10:00 am - 5:30 pm', name: 'Harlyn', status: 'In' },
    { time: '5:00 pm - 11:30 pm', name: 'Saysay', status: null }
  ]

  const kitchenStaff = [
    { time: '8:00 am - 5:30 pm', name: 'Marco', status: null },
    { time: '10:00 am - 5:30 pm', name: 'Ian', status: null },
    { time: '5:00 pm - 11:30 pm', name: 'Val', status: null }
  ]

  const requests = [
    { type: 'Cash Advance', user: 'Marco', amount: '₱1,000', status: 'Pending' },
    { type: 'Cash Advance', user: 'Val', amount: '₱500', status: 'Approved' },
    { type: 'Leave of absence', user: 'Ian', details: 'important matters', status: 'Approved' }
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Staff Today Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Staff Today</h2>
        
        {/* Dining Section */}
        <div className="mb-6">
          <h3 className="text-gray-400 mb-2">Dining</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2">Time</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {diningStaff.map((staff, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-2 text-gray-600">{staff.time}</td>
                  <td className="py-2">{staff.name}</td>
                  <td className="py-2">
                    {staff.status && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        staff.status === 'In' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Kitchen Section */}
        <div>
          <h3 className="text-gray-400 mb-2">Kitchen</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2">Time</th>
                <th className="pb-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {kitchenStaff.map((staff, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-2 text-gray-600">{staff.time}</td>
                  <td className="py-2">{staff.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  <h3 className="font-medium">{request.type}</h3>
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