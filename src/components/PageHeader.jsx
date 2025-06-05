import React from 'react'

function PageHeader({ title, children, navigation }) {
  return (
    <div className="bg-white shadow-sm mb-6">
      <div className="px-8 h-[72px] flex items-center">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            {navigation && (
              <nav className="flex items-center mr-6">
                {navigation}
              </nav>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader 