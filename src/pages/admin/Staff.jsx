import PageHeader from '../../components/PageHeader'
import { UserPlus, Clock, Calendar, DollarSign, ClipboardList, FileText } from 'lucide-react'

function Staff() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader title="Staff Management">
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <UserPlus className="w-5 h-5 mr-2" />
            Add Staff
          </button>
        </div>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <a href="#profiles" className="border-b-2 border-orange-500 text-orange-600 whitespace-nowrap py-4 px-6 font-medium text-sm">
              Profiles
            </a>
            <a href="#attendance" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm">
              Attendance Tracking
            </a>
            <a href="#payroll" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm">
              Payroll
            </a>
            <a href="#shifts" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm">
              Shifts
            </a>
            <a href="#requests" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm">
              Request
            </a>
            <a href="#reports" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 font-medium text-sm">
              Reports
            </a>
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {/* Total Staff */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Staff</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>

          {/* Hours Worked */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hours Today</p>
                <p className="text-2xl font-semibold text-gray-900">182.5</p>
              </div>
            </div>
          </div>

          {/* Scheduled Today */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled Today</p>
                <p className="text-2xl font-semibold text-gray-900">18</p>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900">7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-gray-50">
          <div className="text-center text-gray-500">
            Select a tab to view content
          </div>
        </div>
      </div>
    </div>
  )
}

export default Staff 