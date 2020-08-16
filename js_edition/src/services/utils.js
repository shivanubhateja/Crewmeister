import moment from 'moment';
moment().format();

export const DifferenceInPeriods = (startDate, endDate, units, inclusiveOfBothDates) => {
    var diff = moment(endDate).diff(moment(startDate), units);
    if(inclusiveOfBothDates) diff++;
    return diff;
}

export const ConvertDateToICalCompatibleFormat = (date) => {
    return moment(date).transform('YYYYMMDD');
} 
