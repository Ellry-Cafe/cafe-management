import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Home, History, CalendarDays, FileText, LogOut } from 'lucide-react';
import { convertTo12Hour } from '../utils/timeUtils';

function getQueryParam(name, search) {
  const params = new URLSearchParams(search);
  return params.get(name);
}

function formatTime(timeStr) {
  if (!timeStr) return '--';
  // Convert 24-hour format to 12-hour format for display
  return convertTo12Hour(timeStr);
}

const StaffAttendanceSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const idNumber = getQueryParam('id_number', location.search);

  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!idNumber) {
      navigate('/staff-attendance/login');
      return;
    }
    const fetchUserAndSchedule = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name')
          .eq('id_number', idNumber)
          .single();
        if (userError || !userData) {
          setError('User not found.');
          setTimeout(() => navigate('/staff-attendance/login'), 1500);
          return;
        }
        setUser(userData);
        // Fetch schedule
        const { data: schedData, error: schedError } = await supabase
          .from('schedules')
          .select('day_of_week, shift_start, shift_end')
          .eq('staff_id', userData.id)
          .order('day_of_week', { ascending: true });
        if (schedError) throw schedError;
        setSchedule(schedData || []);
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setError('Failed to load schedule.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndSchedule();
  }, [idNumber, navigate]);

  // Remove debug bar
  // Sort schedule by day of week
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  // Map for quick lookup (now as array of shifts per day)
  const scheduleMap = {};
  dayOrder.forEach(day => { scheduleMap[day] = []; });
  schedule.forEach(row => {
    const day = row.day_of_week.toLowerCase();
    if (scheduleMap[day]) {
      scheduleMap[day].push(row);
    }
  });

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col items-center pb-24 overflow-y-auto">
        <div className="w-full">
          <div className="bg-blue-700 text-white text-center py-4 text-xl font-bold w-full">Schedule</div>
          <div className="p-4">
            {user && <div className="text-lg font-semibold mb-4">Staff: {user.name}</div>}
            {loading ? (
              <div className="text-center text-gray-500 py-4">Loading schedule...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <div className="border rounded-lg bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left font-semibold">Day</th>
                      <th className="p-2 text-left font-semibold">Shift Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayOrder.map((day) => {
                      const shifts = scheduleMap[day];
                      return (
                        <tr key={day} className="border-b last:border-b-0">
                          <td className="p-2 capitalize">{day}</td>
                          <td className="p-2" colSpan={2}>
                            {shifts.length > 0
                              ? shifts.map(s => `${formatTime(s.shift_start)} - ${formatTime(s.shift_end)}`).join(', ')
                              : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <div className="w-full flex justify-around items-center py-2">
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/home?id_number=${encodeURIComponent(idNumber)}`)}
          >
            <Home className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Home</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/history?id_number=${encodeURIComponent(idNumber)}`)}
          >
            <History className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">History</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            disabled
          >
            <CalendarDays className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Schedule</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/request?id_number=${encodeURIComponent(idNumber)}`)}
          >
            <FileText className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Request</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate('/staff-attendance/login')}
          >
            <LogOut className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default StaffAttendanceSchedule; 