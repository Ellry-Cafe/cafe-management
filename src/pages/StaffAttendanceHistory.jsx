import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { Home, History, FileText, ChevronLeft, ChevronRight, CalendarDays, LogOut } from 'lucide-react';

// Utility to get user ID from URL
function getQueryParam(name, search) {
  const params = new URLSearchParams(search);
  return params.get(name);
}

// Formatting functions
function formatDay(dateString) {
  if (!dateString) return '--';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatTime(dateString) {
  if (!dateString) return '--/--';
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

function formatDate(dateString) {
    if (!dateString) return '--/--';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function formatDuration(hours) {
  if (hours === null || typeof hours === 'undefined') return '--';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} hr ${m} min`;
}

const StaffAttendanceHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const idNumber = getQueryParam('id_number', location.search);
  
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Full date object
  const [filterType, setFilterType] = useState('month'); // 'week', 'quincena', 'month'
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const calculateDateRange = useCallback((month, filter) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    let start, end;

    switch (filter) {
      case 'week': {
        const dayOfWeek = month.getDay();
        start = new Date(month);
        start.setDate(month.getDate() - dayOfWeek);
        end = new Date(start);
        end.setDate(start.getDate() + 7);
        break;
      }
      case 'quincena': {
        const dayOfMonth = month.getDate();
        if (dayOfMonth <= 15) {
          start = new Date(year, monthIndex, 1);
          end = new Date(year, monthIndex, 16);
        } else {
          start = new Date(year, monthIndex, 16);
          end = new Date(year, monthIndex + 1, 1);
        }
        break;
      }
      default: // month
        start = new Date(year, monthIndex, 1);
        end = new Date(year, monthIndex + 1, 1);
    }
    setDateRange({ start, end });
  }, []);
  
  const fetchHistory = useCallback(async (userId, range) => {
    if (!userId || !range.start || !range.end) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .gte('clock_in', range.start.toISOString())
        .lt('clock_in', range.end.toISOString())
        .order('clock_in', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!idNumber) {
      navigate('/staff-attendance/login');
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
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
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [idNumber, navigate]);
  
  useEffect(() => {
    calculateDateRange(selectedMonth, filterType);
  }, [selectedMonth, filterType, calculateDateRange]);
  
  useEffect(() => {
      if(user?.id) {
          fetchHistory(user.id, dateRange);
      }
  }, [user, dateRange, fetchHistory])

  const handleDateChange = (increment) => {
    const newDate = new Date(selectedMonth);
    if (filterType === 'week') {
      newDate.setDate(newDate.getDate() + (increment * 7));
    } else if (filterType === 'month') {
      newDate.setMonth(newDate.getMonth() + increment);
    } else { // quincena
        const day = newDate.getDate();
        if (increment > 0) { // next
            if (day <= 15) newDate.setDate(16);
            else newDate.setMonth(newDate.getMonth() + 1, 1);
        } else { // previous
            if (day > 15) newDate.setDate(1);
            else newDate.setMonth(newDate.getMonth() - 1, 16);
        }
    }
    setSelectedMonth(newDate);
  };
  
  const getFormattedRange = () => {
    if (!dateRange.start || !dateRange.end) return '';
    const start = dateRange.start;
    const end = new Date(dateRange.end);
    end.setDate(end.getDate() - 1); // Adjust for display

    const options = { month: 'short', day: 'numeric' };
    
    if (start.getFullYear() !== end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', {...options, year: 'numeric'})} - ${end.toLocaleDateString('en-US', {...options, year: 'numeric'})}`;
    }
    if (start.getMonth() !== end.getMonth()) {
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', {month: 'long'})} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  };

  const totalHours = history.reduce((sum, a) => sum + (a.total_hours || 0), 0);
  const filterButtons = [
    { key: 'week', label: 'Weekly' },
    { key: 'quincena', label: 'Quincena' },
    { key: 'month', label: 'Monthly' }
  ];

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col items-center pb-24 overflow-y-auto">
        <div className="w-full">
          <div className="bg-blue-700 text-white text-center py-4 text-xl font-bold w-full sticky top-0 z-10">
            Attendance History
          </div>
          <div className="p-4">
            {user && <div className="text-lg font-semibold mb-4">Staff: {user.name}</div>}
            
            <div className="mb-4 flex justify-center space-x-1 bg-gray-200 rounded-lg p-1">
                {filterButtons.map(btn => (
                    <button
                        key={btn.key}
                        onClick={() => setFilterType(btn.key)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                            filterType === btn.key
                                ? 'bg-white text-blue-700 shadow'
                                : 'bg-transparent text-gray-600'
                        }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between p-2 rounded-lg border bg-white">
                <button
                  onClick={() => handleDateChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Previous period"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <span className="font-semibold text-center text-gray-700">{getFormattedRange()}</span>
                <button
                  onClick={() => handleDateChange(1)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Next period"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-4">Loading history...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <div className="border rounded-lg bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left font-semibold">Day</th>
                      <th className="p-2 text-left font-semibold">Date</th>
                      <th className="p-2 text-left font-semibold">Clock In</th>
                      <th className="p-2 text-left font-semibold">Clock Out</th>
                      <th className="p-2 text-left font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-gray-400">No records for this period.</td>
                      </tr>
                    ) : (
                      history.map(record => (
                        <tr key={record.id} className="border-b last:border-b-0">
                          <td className="p-2">{formatDay(record.clock_in)}</td>
                          <td className="p-2">{formatDate(record.clock_in)}</td>
                          <td className="p-2">{formatTime(record.clock_in)}</td>
                          <td className="p-2">{record.clock_out ? formatTime(record.clock_out) : '--/--'}</td>
                          <td className="p-2">{formatDuration(record.total_hours)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="p-2 text-right font-medium text-xs text-gray-700 bg-gray-50">
                  Total hours for period: {formatDuration(totalHours)}
                </div>
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
            disabled
          >
            <History className="w-7 h-7 mx-auto" />
            <span className="text-xs mt-1 font-bold">History</span>
          </button>
          <button
            className="flex flex-col items-center flex-1 text-blue-700 font-semibold focus:outline-none"
            onClick={() => navigate(`/staff-attendance/schedule?id_number=${encodeURIComponent(idNumber)}`)}
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

export default StaffAttendanceHistory; 