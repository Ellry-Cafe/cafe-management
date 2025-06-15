import { useEffect, useState } from 'react';
import { getSchedules } from '../../api/schedules';
import ScheduleTable from './ScheduleTable';
import AddScheduleModal from './AddScheduleModal';
import { deleteSchedule } from '../../api/schedules';
import ConfirmModal from '../../components/ConfirmModal';

export default function ScheduleTab() {
  const [schedules, setSchedules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  async function fetchSchedules() {
    const { data, error } = await getSchedules();
    if (!error) setSchedules(data);
  }

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Group schedules by department
  const diningSchedules = schedules.filter(
    s => (s.department || s.users?.department || '').toLowerCase() === 'dining'
  );
  const kitchenSchedules = schedules.filter(
    s => (s.department || s.users?.department || '').toLowerCase() === 'kitchen'
  );

  const handleEdit = (schedule) => {
    // Find all schedules for this staff and department
    const staffSchedules = schedules.filter(
      s => s.staff_id === schedule.staff_id && (s.department || s.users?.department) === (schedule.department || schedule.users?.department)
    );
    setEditingSchedule({
      staff_id: schedule.staff_id,
      department: schedule.department || schedule.users?.department,
      schedules: staffSchedules
    });
    setModalOpen(true);
  };

  const handleDelete = (schedule) => {
    setScheduleToDelete(schedule);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (scheduleToDelete) {
      await deleteSchedule(scheduleToDelete.id);
      fetchSchedules();
      setDeleteModalOpen(false);
      setScheduleToDelete(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingSchedule(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={() => { setModalOpen(true); setEditingSchedule(null); }}
        >
          Create Schedule
        </button>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold mb-2 ml-2 text-gray-700">Dining</h2>
        <ScheduleTable schedules={diningSchedules} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <div>
        <h2 className="font-semibold mb-2 ml-2 text-gray-700">Kitchen</h2>
        <ScheduleTable schedules={kitchenSchedules} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <AddScheduleModal
        open={modalOpen}
        onClose={handleModalClose}
        onCreated={fetchSchedules}
        editingSchedule={editingSchedule}
      />
      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Schedule"
        message={
          scheduleToDelete
            ? `Are you sure you want to delete the schedule for ${scheduleToDelete.users?.first_name || ''} ${scheduleToDelete.users?.last_name || ''} (${scheduleToDelete.day_of_week}, ${scheduleToDelete.shift_start} - ${scheduleToDelete.shift_end})? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setScheduleToDelete(null);
        }}
        iconBg="bg-red-500"
      />
    </div>
  );
}