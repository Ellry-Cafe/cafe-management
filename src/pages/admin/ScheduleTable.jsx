import { convertTo12Hour } from '../../utils/timeUtils';

const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

function ScheduleTable({ schedules, onEdit, onDelete }) {
  // Group by staff, then by day
  const staffMap = {};
  schedules.forEach(shift => {
    const staff = (shift.users && (shift.users.first_name || shift.users.last_name))
      ? `${shift.users.first_name || ''} ${shift.users.last_name || ''}`.trim()
      : (shift.staff_name || 'Unknown');
    if (!staffMap[staff]) staffMap[staff] = {};
    if (!staffMap[staff][shift.day_of_week]) staffMap[staff][shift.day_of_week] = [];
    staffMap[staff][shift.day_of_week].push(shift);
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <table className="min-w-full">
        <thead className="text-gray-600 text-xs">
          <tr>
            <th className="px-4 py-2 text-left">Staff Name</th>
            {days.map(day => (
              <th key={day} className="px-4 py-2 text-left capitalize">{day}</th>
            ))}
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-500 text-xs">
          {Object.entries(staffMap).map(([staff, shiftsByDay]) => (
            <tr key={staff} className="border-t">
              <td className="px-4 py-2">{staff}</td>
              {days.map(day => (
                <td key={day} className="px-4 py-2">
                  {shiftsByDay[day] && shiftsByDay[day].length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {shiftsByDay[day].map((shift, idx) => (
                        <div key={idx}>
                          {convertTo12Hour(shift.shift_start)} - {convertTo12Hour(shift.shift_end)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400"></span>
                  )}
                </td>
              ))}
              <td className="px-4 py-2">
                {Object.values(shiftsByDay).flat().length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => onEdit && onEdit(Object.values(shiftsByDay).flat()[0])}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDelete && onDelete(Object.values(shiftsByDay).flat()[0])}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;