import { useState, useEffect } from 'react';
import { addSchedule, deleteSchedulesForStaffDept } from '../../api/schedules';
import { supabaseAdmin } from '../../config/supabase';
import { X, CalendarPlus, Plus, Trash2 } from 'lucide-react';
import { convertTo24Hour, convertTo12Hour } from '../../utils/timeUtils';

const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const departments = ['dining', 'kitchen'];

const defaultShifts = days.reduce((acc, day) => {
  acc[day] = [{ start: '', end: '' }];
  return acc;
}, {});

function generateTimeOptions() {
  const options = [];
  let hour = 6;
  let minute = 0;
  while (hour < 24) {
    const ampm = hour < 12 ? 'AM' : 'PM';
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;
    const displayMinute = minute === 0 ? '00' : '30';
    options.push(`${displayHour}:${displayMinute} ${ampm}`);
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }
  return options;
}
const timeOptions = generateTimeOptions();

export default function AddScheduleModal({ open, onClose, onCreated, editingSchedule }) {
  const [staffList, setStaffList] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [department, setDepartment] = useState('');
  const [shifts, setShifts] = useState(defaultShifts);

  useEffect(() => {
    if (open) {
      supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, department')
        .then(({ data }) => setStaffList(data || []));
      if (editingSchedule) {
        setStaffId(editingSchedule.staff_id);
        setDepartment(editingSchedule.department);
        // Prefill shifts for each day
        const prefill = days.reduce((acc, day) => {
          const dayShifts = (editingSchedule.schedules || []).filter(s => s.day_of_week === day);
          acc[day] = dayShifts.length > 0
            ? dayShifts.map(s => ({ 
                start: convertTo12Hour(s.shift_start), 
                end: convertTo12Hour(s.shift_end) 
              }))
            : [{ start: '', end: '' }];
          return acc;
        }, {});
        setShifts(prefill);
      } else {
        setStaffId('');
        setDepartment('');
        setShifts(days.reduce((acc, day) => {
          acc[day] = [{ start: '', end: '' }];
          return acc;
        }, {}));
      }
    }
  }, [open, editingSchedule]);

  const handleShiftChange = (day, idx, field, value) => {
    setShifts(prev => ({
      ...prev,
      [day]: prev[day].map((shift, i) =>
        i === idx ? { ...shift, [field]: value } : shift
      ),
    }));
  };

  const handleAddShift = (day) => {
    setShifts(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '', end: '' }],
    }));
  };

  const handleRemoveShift = (day, idx) => {
    setShifts(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!staffId || !department) {
      alert('Please select both staff and department.');
      return;
    }
    // If editing, delete all old schedules for this staff and department first
    if (editingSchedule) {
      await deleteSchedulesForStaffDept(staffId, department);
    }
    let saved = false;
    for (const day of days) {
      for (const shift of shifts[day]) {
        if (
          shift.start &&
          shift.end
        ) {
          // Convert AM/PM times to 24-hour format before saving
          const shiftStart24h = convertTo24Hour(shift.start);
          const shiftEnd24h = convertTo24Hour(shift.end);
          
          const { error } = await addSchedule({
            staff_id: staffId,
            department,
            day_of_week: day,
            shift_start: shiftStart24h,
            shift_end: shiftEnd24h,
          });
          if (error) {
            alert('Error saving schedule: ' + error.message);
            return;
          }
          saved = true;
        }
      }
    }
    if (!saved) {
      alert('No valid shifts to save.');
      return;
    }
    onClose();
    if (onCreated) onCreated();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-600">
            <CalendarPlus className="w-6 h-6 text-orange-600" />
            Create Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
              <select
                value={staffId}
                onChange={e => setStaffId(e.target.value)}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select staff</option>
                {staffList.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {`${staff.first_name || ''} ${staff.last_name || ''}`.trim() || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select department</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep.charAt(0).toUpperCase() + dep.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full mt-4 text-gray-800">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1">Day</th>
                  <th className="text-left px-2 py-1">Shift Start</th>
                  <th className="text-left px-2 py-1">Shift End</th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day}>
                    <td className="font-medium px-2 py-1 align-top">{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                    <td colSpan={3} className="p-0">
                      {shifts[day].map((shift, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-1">
                          <select
                            value={shift.start}
                            onChange={e => handleShiftChange(day, idx, 'start', e.target.value)}
                            className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="">--:-- --</option>
                            {timeOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <span>-</span>
                          <select
                            value={shift.end}
                            onChange={e => handleShiftChange(day, idx, 'end', e.target.value)}
                            className="block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="">--:-- --</option>
                            {timeOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          {shifts[day].length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveShift(day, idx)}
                              className="text-red-500 hover:text-red-700"
                              title="Remove shift"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddShift(day)}
                        className="text-green-600 hover:text-green-800 flex items-center text-xs mt-1 mb-3"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Shift
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <CalendarPlus className="w-5 h-5 mr-2" />
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}