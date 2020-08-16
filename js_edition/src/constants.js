export const icalRawEvent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ICalendarCreator//NONSGML//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:#startDate
DTEND;VALUE=DATE:#endDate
SUMMARY:#summary
LOCATION:#location
DESCRIPTION:#description
END:VEVENT
END:VCALENDAR

`;

export const USER_DOES_NOT_EXIST = "User does not exist";
export const LEAVE_TYPE_SICKNESS = "sickness";
export const LEAVE_TYPE_VACATION = "vacation";
