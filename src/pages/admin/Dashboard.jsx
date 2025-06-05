import PageHeader from '../../components/PageHeader'
import { Facebook, Twitter, Linkedin, XCircle } from 'lucide-react'

function Dashboard() {
  return (
    <div>
      <PageHeader title="Board">
        {/* Add any header actions here if needed */}
      </PageHeader>

      <div className="px-8 py-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Staff Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Staff</span>
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">2,500</div>
              <div className="text-sm text-gray-500 mt-2">Total staff members</div>
            </div>
          </div>

          {/* Sales Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Sales</span>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">₱123.50</div>
              <div className="text-sm text-gray-500 mt-2">Today's total sales</div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Expenses</span>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">₱1,805</div>
              <div className="text-sm text-gray-500 mt-2">Total expenses today</div>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Bookings</span>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">54</div>
              <div className="text-sm text-gray-500 mt-2">Active bookings</div>
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Facebook Card */}
          <div className="bg-[#1877F2] bg-opacity-10 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Facebook className="w-5 h-5 text-[#1877F2] mr-2" />
                  <span className="text-sm font-medium text-gray-900">Facebook</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">35k</span>
                  <span className="text-sm text-gray-500 ml-2">Friends</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">128 Feeds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="bg-[#1DA1F2] bg-opacity-10 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Twitter className="w-5 h-5 text-[#1DA1F2] mr-2" />
                  <span className="text-sm font-medium text-gray-900">Twitter</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">584k</span>
                  <span className="text-sm text-gray-500 ml-2">Followers</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">978 Tweets</span>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="bg-[#0A66C2] bg-opacity-10 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Linkedin className="w-5 h-5 text-[#0A66C2] mr-2" />
                  <span className="text-sm font-medium text-gray-900">LinkedIn</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">758+</span>
                  <span className="text-sm text-gray-500 ml-2">Contacts</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">365 Feeds</span>
                </div>
              </div>
            </div>
          </div>

          {/* X (Twitter) Card */}
          <div className="bg-black bg-opacity-10 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-gray-900 mr-2" />
                  <span className="text-sm font-medium text-gray-900">X</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">450</span>
                  <span className="text-sm text-gray-500 ml-2">Followers</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">57 Circles</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center text-gray-500 py-12">
            Chart will be implemented here
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard