import { useState, useEffect } from 'react';
import { addSchedule, updateSchedule } from '../../api/schedules';
import { supabaseAdmin } from '../../config/supabase';
import { X, CalendarPlus } from 'lucide-react';

const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const departments = ['dining', 'kitchen'];

function AddScheduleModal({ open, onClose, onCreated, editingSchedule }) {
  const [staffList, setStaffList] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [day, setDay] = useState('monday');
  const [department, setDepartment] = useState('dining');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');

  useEffect(() => {
    if (open) {
      supabaseAdmin
        .from('users')
        .select('id, name')
        .then(({ data }) => setStaffList(data || []));
    }
  }, [open]);

  useEffect(() => {
    if (editingSchedule) {
      setStaffId(editingSchedule.staff_id);
      setDay(editingSchedule.day_of_week);
      setDepartment(editingSchedule.department || editingSchedule.users?.department || 'dining');
      setShiftStart(editingSchedule.shift_start ? to24h(editingSchedule.shift_start) : '');
      setShiftEnd(editingSchedule.shift_end ? to24h(editingSchedule.shift_end) : '');
    } else {
      setStaffId('');
      setDay('monday');
      setDepartment('dining');
      setShiftStart('');
      setShiftEnd('');
    }
  }, [editingSchedule, open]);

  function toAmPm(time24) {
    if (!time24) return '';
    let [h, m] = time24.split(':');
    h = parseInt(h, 10);
    const ap = h >= 12 ? 'pm' : 'am';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h}:${m}${ap}`;
  }
  function to24h(time) {
    // Converts '8:00am' or '6:00pm' to '08:00' or '18:00'
    if (!time) return '';
    const match = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
    if (match) {
      let [, h, m, ap] = match;
      h = parseInt(h, 10);
      if (ap.toLowerCase() === 'pm' && h !== 12) h += 12;
      if (ap.toLowerCase() === 'am' && h === 12) h = 0;
      return `${h.toString().padStart(2, '0')}:${m}`;
    }
    return time;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-600">
            <CalendarPlus className="w-6 h-6 text-orange-600" />
            {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Form */}
        <form
          onSubmit={async e => {
            e.preventDefault();
            const formattedStart = toAmPm(shiftStart);
            const formattedEnd = toAmPm(shiftEnd);
            if (editingSchedule) {
              await updateSchedule(editingSchedule.id, {
                staff_id: staffId,
                day_of_week: day,
                shift_start: formattedStart,
                shift_end: formattedEnd,
                department
              });
            } else {
              await addSchedule({ staff_id: staffId, day_of_week: day, shift_start: formattedStart, shift_end: formattedEnd, department });
            }
            onClose();
            if (onCreated) onCreated();
          }}
          className="space-y-4"
        >
          {/* Staff, Day, Department in one row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
              <select
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                value={staffId}
                onChange={e => setStaffId(e.target.value)}
                required
              >
                <option value="">Select staff</option>
                {staffList.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                value={day}
                onChange={e => setDay(e.target.value)}
              >
                {days.map(d => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                required
              >
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep.charAt(0).toUpperCase() + dep.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Shift Start/End */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift Start</label>
              <input
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                value={shiftStart}
                onChange={e => setShiftStart(e.target.value)}
                placeholder="e.g. 8:00am"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift End</label>
              <input
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                value={shiftEnd}
                onChange={e => setShiftEnd(e.target.value)}
                placeholder="e.g. 2:00pm"
                required
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <CalendarPlus className="w-5 h-5 mr-2" />
              {editingSchedule ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddScheduleModal;