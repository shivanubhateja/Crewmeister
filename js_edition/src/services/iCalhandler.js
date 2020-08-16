const ical = require('ical-generator');

export const generateCalenderFile = (listICalEvents) => {
    return ical({
        domain: 'https://crewmeister.com/',
        name: 'Mock test',
    });
}

export const addEventToCalender = (cal, summary, description, startDate, endDate) => {
    cal.createEvent({
        start: startDate,
        end: endDate,
        summary,
        description
    });
}

export const saveCalToFile = (cal) => {
    cal.saveSync("leavePlan.ics", (_) => {
        if(_) {
            console.log(_);
            return;
        } else {
            console.log("successfully saved")
        }
    });
}
