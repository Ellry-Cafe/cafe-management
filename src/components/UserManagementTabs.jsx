import { Search, Filter, UserPlus } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'profile', label: 'Profile' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'attendance', label: 'Attendance Tracking' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'request', label: 'Request' },
  { id: 'reports', label: 'Reports' }
]

function UserManagementTabs({ activeTab, onTabChange, onAddUser }) {
  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  const handleAddUserClick = () => {
    if (onAddUser) {
      onAddUser()
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white w-full py-6 px-8 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddUserClick}
              className="inline-flex items-center px-4 py-2 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-500 transition-colors"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`
                  whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm cursor-pointer
                  ${activeTab === tab.id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filter Bar */}
        {activeTab !== 'schedule' && (
          <div className="mt-6 flex items-center justify-between gap-4 bg-white rounded-lg p-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"
              />
            </div>
            <div className="w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-500">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="barista">Barista</option>
                  <option value="cashier">Cashier</option>
                  <option value="cook">Cook</option>
                  <option value="assistant_cook">Assistant Cook</option>
                  <option value="dining_crew">Dining Crew</option>
                  <option value="kitchen_crew">Kitchen Crew</option>
                  <option value="inventory_manager">Inventory Manager</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagementTabs 