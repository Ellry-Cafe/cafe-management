import { useEffect, useState } from 'react';
import { getSchedules } from '../../api/schedules';
import ScheduleTable from './ScheduleTable';
import AddScheduleModal from './AddScheduleModal';
import { deleteSchedule } from '../../api/schedules';

export default function ScheduleTab() {
  const [schedules, setSchedules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  async function fetchSchedules() {
    const { data, error } = await getSchedules();
    if (!error) setSchedules(data);
  }

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Group schedules by department
  const diningSchedules = schedules.filter(
    s => s.users?.department === 'dining'
  );
  const kitchenSchedules = schedules.filter(
    s => s.users?.department === 'kitchen'
  );

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setModalOpen(true);
  };

  const handleDelete = async (schedule) => {
    if (window.confirm('Delete this schedule?')) {
      await deleteSchedule(schedule.id);
      fetchSchedules();
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
        <h2 className="text-lg font-semibold mb-2">Dining Schedule</h2>
        <ScheduleTable schedules={diningSchedules} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Kitchen Schedule</h2>
        <ScheduleTable schedules={kitchenSchedules} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <AddScheduleModal
        open={modalOpen}
        onClose={handleModalClose}
        onCreated={fetchSchedules}
        editingSchedule={editingSchedule}
      />
    </div>
  );
}