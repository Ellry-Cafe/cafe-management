import { AdminLayout } from '../../layouts/AdminLayout'

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-medium">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-orange-400 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">2,500</div>
            <div className="text-gray-500 mt-1">Welcome</div>
          </div>

          {/* Average Time Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">123.50</div>
            <div className="text-gray-500 mt-1">Average Time</div>
          </div>

          {/* Collections Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-teal-400 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-9-3.82l-2.09-2.09L6.5 13.5 10 17l6.01-6.01-1.41-1.41z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">1,805</div>
            <div className="text-gray-500 mt-1">Collections</div>
          </div>

          {/* Comments Card */}
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-pink-400 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">54</div>
            <div className="text-gray-500 mt-1">Comments</div>
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