import supabase from '../config/supabase'

// Attendance API functions
export const attendanceAPI = {
  // Clock in a staff member
  async clockIn(userId) {
    try {
      console.log('Attempting to clock in user:', userId)
      const now = new Date()
      
      // 1. Check if user has an active attendance record from previous shift
      const { data: activeRecords, error: activeError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('clock_in', { ascending: false })

      if (activeError) {
        console.error('Error checking active records:', activeError)
        return { success: false, error: 'Failed to check active attendance records' }
      }

      // If there's an active record from a previous day, auto-clock out using scheduled end time
      if (activeRecords && activeRecords.length > 0) {
        const activeRecord = activeRecords[0]
        const clockInDate = new Date(activeRecord.clock_in)
        const today = new Date()
        
        // Check if the active record is from a previous day
        if (clockInDate.toDateString() !== today.toDateString()) {
          console.log('Found active record from previous day, auto-clocking out...')
          
          // Find the schedule for the previous day
          const previousDay = clockInDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
          const { data: schedules, error: schedError } = await supabase
            .from('schedules')
            .select('*')
            .eq('staff_id', userId)
            .eq('day_of_week', previousDay)

          if (schedError) {
            console.error('Error finding previous day schedule:', schedError)
            return { success: false, error: 'Failed to find schedule for previous day' }
          }

          if (!schedules || schedules.length === 0) {
            console.error('No schedule found for previous day')
            return { success: false, error: 'No schedule found for previous day' }
          }

          // Find the shift that matches the clock_in time
          let matchedShift = null
          for (const sched of schedules) {
            if (!sched.shift_start || !sched.shift_end) continue
            const [startH, startM] = sched.shift_start.split(':').map(Number)
            const [endH, endM] = sched.shift_end.split(':').map(Number)
            if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) continue
            const shiftStart = new Date(clockInDate)
            shiftStart.setHours(startH, startM, 0, 0)
            const shiftEnd = new Date(clockInDate)
            shiftEnd.setHours(endH, endM, 0, 0)
            if (clockInDate >= shiftStart && clockInDate <= shiftEnd) {
              matchedShift = { ...sched, shiftStart, shiftEnd }
              break
            }
          }

          // If not found, use the first shift
          if (!matchedShift) {
            matchedShift = { ...schedules[0] }
            if (!matchedShift.shift_end) {
              console.error('Fallback schedule has invalid shift_end:', matchedShift)
              return { success: false, error: 'Invalid shift_end in schedule.' }
            }
            const [endH, endM] = matchedShift.shift_end.split(':').map(Number)
            if (isNaN(endH) || isNaN(endM)) {
              console.error('Fallback schedule has invalid shift_end time format:', matchedShift)
              return { success: false, error: 'Invalid shift_end time format in schedule.' }
            }
            matchedShift.shiftEnd = new Date(clockInDate)
            matchedShift.shiftEnd.setHours(endH, endM, 0, 0)
          }

          // Auto-clock out using scheduled end time
          const scheduledEnd = matchedShift.shiftEnd
          const duration = (scheduledEnd - clockInDate) / (1000 * 60 * 60)
          
          const { error: updateError } = await supabase
            .from('attendance')
            .update({
              clock_out: scheduledEnd.toISOString(),
              status: 'completed',
              total_hours: duration
            })
            .eq('id', activeRecord.id)

          if (updateError) {
            console.error('Auto-clock out error:', updateError)
            return { success: false, error: 'Failed to auto-clock out previous record' }
          }

          console.log('Successfully auto-clocked out previous record')
        } else {
          // Active record is from today, prevent clock in
          return { success: false, error: 'You already have an active attendance record for today. Please clock out first.' }
        }
      }

      // 2. Find today's schedule for the user
      const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
      const { data: schedules, error: schedError } = await supabase
        .from('schedules')
        .select('*')
        .eq('staff_id', userId)
        .eq('day_of_week', dayOfWeek)

      if (schedError) {
        console.error('Error finding schedule:', schedError)
        return { success: false, error: 'Failed to find schedule for user' }
      }

      if (!schedules || schedules.length === 0) {
        return { success: false, error: 'You have no scheduled shift today.' }
      }

      // 3. Check if now is within any scheduled shift
      let withinShift = false
      for (const sched of schedules) {
        if (!sched.shift_start || !sched.shift_end) continue
        const [startH, startM] = sched.shift_start.split(':').map(Number)
        const [endH, endM] = sched.shift_end.split(':').map(Number)
        if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) continue
        const shiftStart = new Date(now)
        shiftStart.setHours(startH, startM, 0, 0)
        const shiftEnd = new Date(now)
        shiftEnd.setHours(endH, endM, 0, 0)
        if (now >= shiftStart && now <= shiftEnd) {
          withinShift = true
          break
        }
      }
      
      // Only allow clock in within scheduled shift hours
      if (!withinShift) {
        return { success: false, error: 'You are not allowed to clock in outside your scheduled shift hours.' }
      }

      // 4. Proceed with clock in
      const { data, error } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: userId,
            clock_in: now.toISOString(),
            status: 'active'
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Clock in error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Clock in error:', error)
      return { success: false, error: 'Failed to clock in' }
    }
  },

  // Clock out a staff member
  async clockOut(userId) {
    try {
      console.log('Attempting to clock out user:', userId)
      // 1. Get all active records for the user
      const { data: activeRecords, error: findError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('clock_in', { ascending: false })

      if (findError) {
        console.error('Error finding active records:', findError)
        return { success: false, error: 'Failed to find active attendance record' }
      }

      if (!activeRecords || activeRecords.length === 0) {
        console.error('No active attendance record found')
        return { success: false, error: 'No active attendance record found' }
      }

      // Use the most recent active record
      const activeRecord = activeRecords[0]
      const clockIn = new Date(activeRecord.clock_in)
      const now = new Date()

      // 2. Find the user's schedule for the day of clock_in
      const dayOfWeek = clockIn.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
      const { data: schedules, error: schedError } = await supabase
        .from('schedules')
        .select('*')
        .eq('staff_id', userId)
        .eq('day_of_week', dayOfWeek)

      if (schedError) {
        console.error('Error finding schedule:', schedError)
        return { success: false, error: 'Failed to find schedule for user' }
      }

      if (!schedules || schedules.length === 0) {
        console.error('No schedule found for user on this day')
        return { success: false, error: 'No schedule found for user on this day' }
      }

      // 3. Find the shift that matches the clock_in time
      let matchedShift = null
      for (const sched of schedules) {
        if (!sched.shift_start || !sched.shift_end) {
          console.error('Invalid schedule shift_start or shift_end:', sched);
          continue;
        }
        // Parse shift_start and shift_end as times
        const [startH, startM] = sched.shift_start.split(':').map(Number)
        const [endH, endM] = sched.shift_end.split(':').map(Number)
        if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
          console.error('Invalid shift_start or shift_end time format:', sched);
          continue;
        }
        const shiftStart = new Date(clockIn)
        shiftStart.setHours(startH, startM, 0, 0)
        const shiftEnd = new Date(clockIn)
        shiftEnd.setHours(endH, endM, 0, 0)
        // If clock_in is within this shift (or before shift end)
        if (clockIn >= shiftStart && clockIn <= shiftEnd) {
          matchedShift = { ...sched, shiftStart, shiftEnd }
          break
        }
      }
      // If not found, fallback to the first shift
      if (!matchedShift) {
        matchedShift = { ...schedules[0] }
        if (!matchedShift.shift_end) {
          console.error('Fallback schedule has invalid shift_end:', matchedShift);
          return { success: false, error: 'Invalid shift_end in schedule.' };
        }
        const [endH, endM] = matchedShift.shift_end.split(':').map(Number)
        if (isNaN(endH) || isNaN(endM)) {
          console.error('Fallback schedule has invalid shift_end time format:', matchedShift);
          return { success: false, error: 'Invalid shift_end time format in schedule.' };
        }
        matchedShift.shiftEnd = new Date(clockIn)
        matchedShift.shiftEnd.setHours(endH, endM, 0, 0)
      }
      const scheduledEnd = matchedShift.shiftEnd

      // 4. Determine clock_out time and overtime
      // If user clocks out before scheduled end, use actual time. If after, use scheduled end.
      let clockOutTime = now <= scheduledEnd ? now : scheduledEnd
      let overtimeStart = null
      let overtimeEnd = null
      let overtimeHours = 0
      if (now > scheduledEnd) {
        overtimeStart = scheduledEnd
        overtimeEnd = now
        overtimeHours = (overtimeEnd - overtimeStart) / (1000 * 60 * 60)
      }

      // 5. Update attendance record
      const duration = (clockOutTime - clockIn) / (1000 * 60 * 60)
      const { data: updatedRecord, error: updateError } = await supabase
        .from('attendance')
        .update({
          clock_out: clockOutTime.toISOString(),
          status: 'completed',
          total_hours: duration
        })
        .eq('id', activeRecord.id)
        .select()
        .single()

      if (updateError) {
        console.error('Clock out update error:', updateError)
        return { success: false, error: updateError.message }
      }

      // 6. If overtime, create overtime record
      if (overtimeHours > 0.01) {
        const { error: overtimeError } = await supabase
          .from('overtime')
          .insert([{
            user_id: userId,
            attendance_id: activeRecord.id,
            start_time: overtimeStart.toISOString(),
            end_time: overtimeEnd.toISOString(),
            hours: overtimeHours,
            notes: 'Overtime: clocked out late, pending approval',
            status: 'pending'
          }])
        if (overtimeError) {
          console.error('Failed to create overtime record:', overtimeError)
        }
      }

      return { success: true, data: updatedRecord }
    } catch (error) {
      console.error('Clock out error:', error)
      return { success: false, error: 'Failed to clock out' }
    }
  },

  // Get current attendance status for a user
  async getCurrentStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error) {
        console.error('Get current status error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get current status error:', error)
      return { success: false, error: 'Failed to get current status' }
    }
  },

  // Get attendance history for a user
  async getAttendanceHistory(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .gte('clock_in', startDate)
        .lt('clock_in', endDate)
        .order('clock_in', { ascending: true })

      if (error) {
        console.error('Get attendance history error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get attendance history error:', error)
      return { success: false, error: 'Failed to get attendance history' }
    }
  },

  // Get all attendance records (admin function)
  async getAllAttendance(startDate = null, endDate = null, userId = null) {
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            role
          )
        `)
        .order('clock_in', { ascending: false })

      if (startDate) {
        query = query.gte('clock_in', startDate)
      }
      if (endDate) {
        query = query.lte('clock_in', endDate)
      }
      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Get all attendance error:', error)
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get all attendance failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Get currently active staff
  async getActiveStaff() {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            role
          )
        `)
        .eq('status', 'active')
        .order('clock_in', { ascending: true })

      if (error) {
        console.error('Get active staff error:', error)
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get active staff failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Update attendance record (admin function)
  async updateAttendance(attendanceId, updates) {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', attendanceId)
        .select()
        .single()

      if (error) {
        console.error('Update attendance error:', error)
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Update attendance failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete attendance record (admin function)
  async deleteAttendance(attendanceId) {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', attendanceId)

      if (error) {
        console.error('Delete attendance error:', error)
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Delete attendance failed:', error)
      return { success: false, error: error.message }
    }
  }
}

export default attendanceAPI 