import { supabaseAdmin } from '../config/supabase';
import { convertTo24Hour } from './timeUtils';

/**
 * Utility function to fix existing schedule times in the database
 * Converts AM/PM format to 24-hour format for all existing schedules
 * Run this once to fix existing data
 */
export async function fixExistingScheduleTimes() {
  try {
    console.log('Fetching all schedules...');
    const { data: schedules, error: fetchError } = await supabaseAdmin
      .from('schedules')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching schedules:', fetchError);
      return;
    }
    
    console.log(`Found ${schedules.length} schedules to process`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const schedule of schedules) {
      try {
        // Check if times are already in 24-hour format
        const startTime24h = convertTo24Hour(schedule.shift_start);
        const endTime24h = convertTo24Hour(schedule.shift_end);
        
        // Only update if conversion actually changed the time
        if (startTime24h !== schedule.shift_start || endTime24h !== schedule.shift_end) {
          const { error: updateError } = await supabaseAdmin
            .from('schedules')
            .update({
              shift_start: startTime24h,
              shift_end: endTime24h
            })
            .eq('id', schedule.id);
          
          if (updateError) {
            console.error(`Error updating schedule ${schedule.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Updated schedule ${schedule.id}: ${schedule.shift_start} → ${startTime24h}, ${schedule.shift_end} → ${endTime24h}`);
            updatedCount++;
          }
        }
      } catch (err) {
        console.error(`Error processing schedule ${schedule.id}:`, err);
        errorCount++;
      }
    }
    
    console.log(`\nFix completed:`);
    console.log(`- Updated: ${updatedCount} schedules`);
    console.log(`- Errors: ${errorCount} schedules`);
    console.log(`- Total processed: ${schedules.length} schedules`);
    
  } catch (error) {
    console.error('Error in fixExistingScheduleTimes:', error);
  }
}

// Example usage:
// import { fixExistingScheduleTimes } from './utils/fixScheduleTimes';
// fixExistingScheduleTimes(); 