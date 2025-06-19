# Cafe Management System - Attendance Setup

## Overview
This system includes a comprehensive staff attendance management feature with clock-in/out functionality, attendance history tracking, and admin management capabilities.

## Features
- **Staff Clock-in/out**: Simple interface for staff to clock in and out
- **Current Status Display**: Shows who is currently working
- **Attendance History**: View and filter attendance records by date
- **Admin Management**: Edit, delete, and manage attendance records
- **Real-time Updates**: Automatic calculation of work hours
- **Role-based Access**: Different views for staff and administrators

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Setup
Run the following migration in your Supabase SQL editor:

```sql
-- File: supabase/migrations/20240323_create_attendance_table.sql
-- This creates the attendance table with all necessary policies and triggers
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

## Database Schema

### Attendance Table
- `id`: Unique identifier (UUID)
- `user_id`: Reference to auth.users
- `clock_in`: Timestamp when user clocked in
- `clock_out`: Timestamp when user clocked out
- `total_hours`: Calculated hours worked
- `location`: Optional location field
- `notes`: Optional notes field
- `status`: 'active', 'completed', or 'cancelled'
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

## Security Features
- Row Level Security (RLS) enabled
- Users can only view/edit their own attendance records
- Admins have full access to all records
- Automatic prevention of multiple active records per user
- Automatic calculation of work hours

## Usage

### For Staff
1. Navigate to `/admin/attendance`
2. Click "Clock In" to start your shift
3. Click "Clock Out" when your shift ends
4. View your attendance history by date

### For Administrators
1. Navigate to `/admin/attendance`
2. Switch to "Admin View" to see all active staff
3. View attendance history for all staff
4. Edit or delete attendance records as needed
5. Filter records by date and staff member

## API Functions

The attendance system includes the following API functions:

- `clockIn(userId, location)`: Clock in a staff member
- `clockOut(userId)`: Clock out a staff member
- `getCurrentStatus(userId)`: Get current attendance status
- `getAttendanceHistory(userId, startDate, endDate)`: Get attendance history
- `getAllAttendance(startDate, endDate, userId)`: Get all attendance (admin)
- `getActiveStaff()`: Get currently active staff
- `updateAttendance(attendanceId, updates)`: Update attendance record (admin)
- `deleteAttendance(attendanceId)`: Delete attendance record (admin)

## Troubleshooting

### Common Issues
1. **"User already has an active attendance record"**: Ensure the user is clocked out before clocking in again
2. **Permission denied**: Check that RLS policies are properly configured
3. **Missing environment variables**: Ensure all Supabase environment variables are set

### Database Issues
- Verify that the attendance table was created successfully
- Check that RLS policies are enabled and configured correctly
- Ensure triggers are working properly for automatic calculations

## Support
For issues or questions, check the console logs for detailed error messages and ensure all environment variables are properly configured. 