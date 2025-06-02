import { AdminLayout } from '../../layouts/AdminLayout'
import { CircleDollarSign, Banknote } from 'lucide-react'

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">

        <div >
          <h1 className="text-2xl font-medium text-black">Board</h1>
          
        </div>
        

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">2,500</div>
            <div className="text-gray-500 mt-1">Staff</div>
          </div>

          {/* Sales Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">123.50</div>
            <div className="text-gray-500 mt-1">Sales</div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-amber-500 mb-4">
              <Banknote className="w-8 h-8 mx-auto" strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-bold text-gray-800">₱1,805</div>
            <div className="text-gray-500 mt-1">Expenses</div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-pink-400 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">54</div>
            <div className="text-gray-500 mt-1">Bookings</div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-4 gap-6">
          {/* Facebook */}
          <div className="bg-[#4267B2] rounded-lg p-6 text-white">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">35k</div>
                <div className="text-sm opacity-80">Friends</div>
              </div>
              <div>
                <div className="text-2xl font-bold">128</div>
                <div className="text-sm opacity-80">Feeds</div>
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div className="bg-[#1DA1F2] rounded-lg p-6 text-white">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">584k</div>
                <div className="text-sm opacity-80">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">978</div>
                <div className="text-sm opacity-80">Tweets</div>
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="bg-[#0077B5] rounded-lg p-6 text-white">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">758+</div>
                <div className="text-sm opacity-80">Contacts</div>
              </div>
              <div>
                <div className="text-2xl font-bold">365</div>
                <div className="text-sm opacity-80">Feeds</div>
              </div>
            </div>
          </div>

          {/* Google */}
          <div className="bg-[#DB4437] rounded-lg p-6 text-white">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">450</div>
                <div className="text-sm opacity-80">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">57</div>
                <div className="text-sm opacity-80">Circles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-medium mb-6">Extra Area Chart</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be implemented here
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 