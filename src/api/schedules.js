import { supabaseAdmin } from '../config/supabase';

// CREATE
export async function addSchedule({ staff_id, day_of_week, shift_start, shift_end, department }) {
  return supabaseAdmin
    .from('schedules')
    .insert([{ staff_id, day_of_week, shift_start, shift_end, department }]);
}

// READ (all, or by staff)
export async function getSchedules({ staff_id } = {}) {
  let query = supabaseAdmin.from('schedules').select('*, users(name, department)');
  if (staff_id) query = query.eq('staff_id', staff_id);
  return query;
}

// UPDATE
export async function updateSchedule(id, { day_of_week, shift_start, shift_end, department }) {
  return supabaseAdmin
    .from('schedules')
    .update({ day_of_week, shift_start, shift_end, department })
    .eq('id', id);
}

// DELETE
export async function deleteSchedule(id) {
  return supabaseAdmin
    .from('schedules')
    .delete()
    .eq('id', id);
}