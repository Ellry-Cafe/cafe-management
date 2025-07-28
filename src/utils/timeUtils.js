/**
 * Converts 12-hour AM/PM time format to 24-hour format
 * @param {string} time12h - Time in 12-hour format (e.g., "9:30 AM", "2:15 PM")
 * @returns {string} Time in 24-hour format (e.g., "09:30", "14:15")
 */
export function convertTo24Hour(time12h) {
  if (!time12h || time12h === '--:-- --') return '';
  
  // Parse the time string
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    console.warn(`Invalid time format: ${time12h}`);
    return time12h; // Return original if parsing fails
  }
  
  let [_, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  
  // Convert to 24-hour format
  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Format with leading zeros
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Converts 24-hour time format to 12-hour AM/PM format
 * @param {string} time24h - Time in 24-hour format (e.g., "09:30", "14:15")
 * @returns {string} Time in 12-hour format (e.g., "9:30 AM", "2:15 PM")
 */
export function convertTo12Hour(time24h) {
  if (!time24h) return '';
  
  // Parse the time string
  const match = time24h.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    console.warn(`Invalid 24-hour time format: ${time24h}`);
    return time24h; // Return original if parsing fails
  }
  
  let [_, hours, minutes] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  
  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  // Format with leading zeros for minutes
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
} 