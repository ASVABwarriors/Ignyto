import { formatInTimeZone } from "date-fns-tz";

export const timezoneAbbreviationMap: Record<string, string> = {
  "America/Los_Angeles": "PST",
  "America/New_York": "EST",
  "Europe/London": "GMT",
  "Asia/Dubai": "GST",
  "Asia/Kolkata": "IST",
  "Asia/Singapore": "SGT",
  "Australia/Sydney": "AEST",
  "UTC": "UTC"
};

export function formatCourseDate(startDate: Date | null, timezone: string | null): string {
  if (!startDate) return "Not set";
  
  // We format it strictly in UTC so the literal string the user typed is preserved
  const formattedDate = formatInTimeZone(startDate, 'UTC', "MMMM d, yyyy 'at' h:mm a");
  
  if (timezone && timezoneAbbreviationMap[timezone]) {
    return `${formattedDate} ${timezoneAbbreviationMap[timezone]}`;
  }
  
  if (timezone) {
    return `${formattedDate} ${timezone}`;
  }

  return formattedDate;
}

export function formatCourseDateShort(startDate: Date | null, timezone: string | null): string {
  if (!startDate) return "TBD";
  const formattedDate = formatInTimeZone(startDate, 'UTC', "MMMM d, yyyy");
  return formattedDate;
}
