import { useState } from 'react'
import UserManagementTabs from '../../components/UserManagementTabs'
import UserDashboard from '../../components/UserDashboard'
import Users from './Users' // This is your existing Users component that will serve as the Profile tab
import CreateUser from './CreateUser'
import ScheduleTab from './ScheduleTab';
import AddScheduleModal from './AddScheduleModal';

function UserManagement() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [usersRefreshKey, setUsersRefreshKey] = useState(0)

  const handleAddUser = () => {
    setCreateModalOpen(true)
  }

  const handleUserCreated = () => {
    setUsersRefreshKey((k) => k + 1)
    setCreateModalOpen(false)
  }

  const handleUserUpdated = () => {
    setUsersRefreshKey((k) => k + 1)
  }

  const handleUserDeleted = () => {
    setUsersRefreshKey((k) => k + 1)
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UserDashboard />
      case 'profile':
        return <Users refreshKey={usersRefreshKey} onUserUpdated={handleUserUpdated} onUserDeleted={handleUserDeleted} />
      case 'schedule':
        return <ScheduleTab />
      case 'attendance':
        return <div>Attendance Tracking Content (Coming Soon)</div>
      case 'payroll':
        return <div>Payroll Content (Coming Soon)</div>
      case 'request':
        return <div>Request Content (Coming Soon)</div>
      case 'reports':
        return <div>Reports Content (Coming Soon)</div>
      default:
        return <UserDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs Navigation */}
      <UserManagementTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onAddUser={handleAddUser}
        onAddSchedule={() => setScheduleModalOpen(true)}
      />

      {/* Tab Content */}
      <div className="px-8 py-6">
        {renderTabContent()}
      </div>

      {/* Create User Modal */}
      <CreateUser 
        isOpen={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onUserCreated={handleUserCreated}
      />

    <AddScheduleModal
      open={scheduleModalOpen}
      onClose={() => setScheduleModalOpen(false)}
      onCreated={() => {}}
    />
    </div>
  )
}

export default UserManagement 