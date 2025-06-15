import { supabaseAdmin } from '../config/supabase';

// CREATE
export async function addSchedule({ staff_id, day_of_week, shift_start, shift_end, department }) {
  return supabaseAdmin
    .from('schedules')
    .insert([{ staff_id, day_of_week: day_of_week.toLowerCase(), shift_start, shift_end, department: department.toLowerCase() }]);
}

// READ (all, or by staff)
export async function getSchedules({ staff_id } = {}) {
  let query = supabaseAdmin.from('schedules').select('*, users(first_name, last_name, department)');
  if (staff_id) query = query.eq('staff_id', staff_id);
  const { data, error } = await query;
  // Ensure day_of_week and department are always lowercased for grouping
  if (data) {
    data.forEach(row => {
      if (row.day_of_week) row.day_of_week = row.day_of_week.toLowerCase();
      if (row.department) row.department = row.department.toLowerCase();
      if (row.users && row.users.department) row.users.department = row.users.department.toLowerCase();
    });
  }
  return { data, error };
}

// UPDATE
export async function updateSchedule(id, { day_of_week, shift_start, shift_end, department }) {
  return supabaseAdmin
    .from('schedules')
    .update({ day_of_week: day_of_week.toLowerCase(), shift_start, shift_end, department: department.toLowerCase() })
    .eq('id', id);
}

// DELETE
export async function deleteSchedule(id) {
  return supabaseAdmin
    .from('schedules')
    .delete()
    .eq('id', id);
}

export async function deleteSchedulesForStaffDept(staff_id, department) {
  return supabaseAdmin
    .from('schedules')
    .delete()
    .eq('staff_id', staff_id)
    .eq('department', department.toLowerCase());
}