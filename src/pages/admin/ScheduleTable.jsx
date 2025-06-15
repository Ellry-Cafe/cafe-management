const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

function formatTimeRange(start, end) {
  if (!start || !end) return '';
  // Normalize and format times like '8:00am' or '18:00' to '8:00am' or '6:00pm'
  function format(t) {
    if (!t) return '';
    let match = t.match(/^(\d{1,2}):(\d{2})(am|pm)?$/i);
    if (match) {
      let [, h, m, ap] = match;
      h = parseInt(h, 10);
      if (!ap) ap = h < 12 ? 'am' : 'pm';
      if (h > 12) h -= 12;
      return `${h}:${m}${ap.toLowerCase()}`;
    }
    // Try to parse 24h format
    match = t.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      let [ , h, m ] = match;
      h = parseInt(h, 10);
      const ap = h >= 12 ? 'pm' : 'am';
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
      return `${h}:${m}${ap}`;
    }
    return t;
  }
  return `${format(start)} - ${format(end)}`;
}

function ScheduleTable({ schedules, onEdit, onDelete }) {
  // Group by staff and map days
  const staffMap = {};
  const scheduleMap = {};
  schedules.forEach(shift => {
    const staff = shift.users?.name || shift.staff_name || shift.staff_id;
    if (!staffMap[staff]) staffMap[staff] = {};
    staffMap[staff][shift.day_of_week] = (shift.shift_start && shift.shift_end)
      ? formatTimeRange(shift.shift_start, shift.shift_end)
      : '';
    // Store the schedule object for edit/delete
    if (!scheduleMap[staff]) scheduleMap[staff] = [];
    scheduleMap[staff].push(shift);
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <table className="min-w-full">
        <thead className="text-gray-600">
          <tr>
            <th className="px-4 py-2 text-left">Staff Name</th>
            {days.map(day => (
              <th key={day} className="px-4 py-2 text-left capitalize">{day}</th>
            ))}
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-500">
          {Object.entries(staffMap).map(([staff, shifts]) => (
            <tr key={staff} className="border-t">
              <td className="px-4 py-2">{staff}</td>
              {days.map(day => (
                <td key={day} className="px-4 py-2">
                  {shifts[day] ? (
                    <span>{shifts[day]}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-2">
                {scheduleMap[staff] && scheduleMap[staff].length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => onEdit && onEdit(scheduleMap[staff][0])}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDelete && onDelete(scheduleMap[staff][0])}
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