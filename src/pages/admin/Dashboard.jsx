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
          {/* Orders Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Orders</span>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2H9C5.13401 2 2 5.13401 2 9V15C2 18.866 5.13401 22 9 22H15C18.866 22 22 18.866 22 15V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">150</div>
              <div className="text-sm text-gray-500 mt-2">Total orders today</div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Revenue</span>
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">₱25,000</div>
              <div className="text-sm text-gray-500 mt-2">Total revenue today</div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Customers</span>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">1,200</div>
              <div className="text-sm text-gray-500 mt-2">Total customers</div>
            </div>
          </div>

          {/* Menu Items Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Menu Items</span>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 18H12.01M7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">50</div>
              <div className="text-sm text-gray-500 mt-2">Active menu items</div>
            </div>
          </div>
        </div>

        {/* Social Media Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Facebook Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">Facebook</span>
              </div>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Page Views</span>
                  <span className="font-medium text-gray-900">10.5K</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Page Likes</span>
                  <span className="font-medium text-gray-900">8.9K</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                <span className="font-medium text-gray-900">Twitter</span>
              </div>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Followers</span>
                  <span className="font-medium text-gray-900">3.2K</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Engagement</span>
                  <span className="font-medium text-gray-900">1.8K</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Linkedin className="w-5 h-5 text-blue-700 mr-2" />
                <span className="font-medium text-gray-900">LinkedIn</span>
              </div>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Connections</span>
                  <span className="font-medium text-gray-900">5.7K</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-700 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Post Views</span>
                  <span className="font-medium text-gray-900">4.2K</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-700 h-2 rounded-full w-3/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard