import React from 'react'

function PageHeader({ title, children }) {
  return (
    <div className="bg-white shadow-sm mb-6">
      <div className="px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader 