import supabase from '../config/supabase'

// Attendance API functions
export const attendanceAPI = {
  // Clock in a staff member
  async clockIn(userId) {
    try {
      console.log('Attempting to clock in user:', userId)
      const { data, error } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: userId,
            clock_in: new Date().toISOString(),
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
      
      // First, get all active records for the user
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
      const clockOut = new Date()
      const duration = (clockOut - new Date(activeRecord.clock_in)) / (1000 * 60 * 60) // Convert to hours

      // Update the record
      const { data: updatedRecord, error: updateError } = await supabase
        .from('attendance')
        .update({
          clock_out: clockOut.toISOString(),
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