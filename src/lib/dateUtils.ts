/**
 * Utilities for handling dates without timezone shifting.
 * 
 * The issue with native `new Date("2026-06-12")` is that it parses as Midnight UTC.
 * Depending on the user's local timezone (e.g., PST which is UTC-8), displaying
 * this date locally will shift it backwards to "June 11, 2026 16:00:00".
 * 
 * To fix this globally:
 * 1. We parse the YYYY-MM-DD string into a Date object set precisely at NOON UTC.
 * 2. We format the Date object back to a string STRICTLY using the UTC timezone.
 * 
 * This ensures "June 12, 2026" looks exactly the same anywhere in the world, 
 * completely ignoring local system timezones.
 */

// Parses a "YYYY-MM-DD" string from a date picker into a safe Noon-UTC Date
export function parseSafeDate(dateString: string): Date {
  if (!dateString) return new Date();
  
  // Extract just the date part if it's longer
  const yyyymmdd = dateString.split('T')[0];
  
  // Append T12:00:00Z to force noon UTC
  return new Date(`${yyyymmdd}T12:00:00Z`);
}

// Formats a Date object into "June 12, 2026" ignoring local timezone
export function formatSafeDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', // Strictly format relative to UTC, not local time
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

// Converts a Date object back to "YYYY-MM-DD" for an HTML <input type="date">
export function toDatePickerFormat(date: Date | string | null | undefined): string {
  if (!date) return "";
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Use UTC methods to extract the exact day
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
