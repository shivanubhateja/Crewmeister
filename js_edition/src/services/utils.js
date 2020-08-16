import moment from 'moment';
import { LEAVE_TYPE_SICKNESS, LEAVE_TYPE_VACATION } from '../constants';
moment().format();

// difference in 2 dates 
export const DifferenceInPeriods = (startDate, endDate, units, inclusiveOfBothDates) => {
    var diff = moment(endDate).diff(moment(startDate), units);
    if(inclusiveOfBothDates) diff++;
    return diff;
}

// get event summary based on leave type and user name
export const getEventSummaryBasedOnTypeOfLeave = (type, name) => {
    switch (type) {
        case LEAVE_TYPE_SICKNESS:
            return `${name} is sick`
        case LEAVE_TYPE_VACATION:
            return `${name} on vacation`
    }
}

// get leave type text
export const getLeaveType = (type) => {
    switch (type) {
        case LEAVE_TYPE_SICKNESS:
            return `sick leave`
        case LEAVE_TYPE_VACATION:
            return `vacation`
    }
}
