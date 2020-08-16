import { members, absences, AbsenceeMap, MembersMap } from '../api';
import { DifferenceInPeriods, getEventSummaryBasedOnTypeOfLeave, getLeaveType } from './utils';
import { USER_DOES_NOT_EXIST, LEAVE_TYPE_SICKNESS, LEAVE_TYPE_VACATION } from '../constants';
import moment from 'moment';
import { generateCalenderFile, addEventToCalender, saveCalToFile } from './iCalhandler';
moment().format();

// get absencees of a member by providing member's userId
export const allAbsenciesAppliedByMember = async (userId) => {
    const allAbsences = await AbsenceeMap();
    if (allAbsences.has(userId)) {
        return allAbsences.get(userId);
    } else {
        // if member does not exists
        return []
    }
}

// get all applied absences for all users, (rejected + approved)
export const allAbsenciesApplied = async () => {
    const allAbsences = await absences();
    const memberMap = await MembersMap();
    allAbsences.forEach(a => a.name = memberMap.get(a.userId).name);
    return allAbsences;
}

// get all approved absences for a member with userid
export const allApprovedAbsenciesOfMember = async (userId) => {
    const allAbsences = await AbsenceeMap();
    if (allAbsences.has(userId)) {
        return allAbsences.get(userId).filter(a => a.confirmedAt);
    } else {
        return []
    }
}

// get all approved absences for all users
export const allAbsenciesApproved = async () => {
    const allAbsences = await absences();
    const memberMap = await MembersMap();
    let onlyApprovedLeaves = allAbsences.filter(a => a.confirmedAt);
    onlyApprovedLeaves.forEach(a => a.name = memberMap.get(a.userId).name);
    return onlyApprovedLeaves;
}

// get all rejected absences of member using userid
export const allRejectedAbsenciesOfMember = async (userId) => {
    const allAbsences = await AbsenceeMap();
    if (allAbsences.has(userId)) {
        return allAbsences.get(userId).filter(a => a.rejectedAt);
    } else {
        return []
    }
}

// get all rejected absences of user
export const allAbsenciesRejected = async () => {
    const allAbsences = await absences();
    const memberMap = await MembersMap();
    var onlyRejectedLeaves = allAbsences.filter(a => a.rejectedAt);
    onlyRejectedLeaves.forEach(a => a.Name = memberMap.get(a.userId));
    return onlyRejectedLeaves;
}

// get all absencees in date range
export const getAbsenceesInDateRange = async (startDate, endDate) => {
    const membersMap = await MembersMap();
    const absenceesList = await absences();
    let dateRangeAbsenceMap = new Map();
    absenceesList.forEach(a => {
        if (!(a.confirmedAt && DifferenceInPeriods(a.startDate, startDate) < 0 && DifferenceInPeriods(a.endDate, endDate) > 0)) {
            return;
        }
        if (dateRangeAbsenceMap.has(a.userId)) {
            var prevValue = dateRangeAbsenceMap.get(a.userId);
            dateRangeAbsenceMap.set(a.userId, {
                name: prevValue.name, userId: a.userId,
                absenceList: [...prevValue.absenceList, { type: a.type, startDate: a.startDate, endDate: a.endDate, description: a.memberNote }]
            })
        } else {
            dateRangeAbsenceMap.set(a.userId, {
                name: membersMap.get(a.userId).name, userId: a.userId,
                absenceList: [{ type: a.type, startDate: a.startDate, endDate: a.endDate, description: a.memberNote }]
            })
        }
    });
    return Array.from(dateRangeAbsenceMap.keys()).map(k => dateRangeAbsenceMap.get(k));
}

// get all absencees of a user
export const getAbsenceesOfAUser = async (userId) => {
    const memberDetails = await getMemberDetails(userId);
    const acceptedLeaves = await allApprovedAbsenciesOfMember(userId);
    return {
        memberDetails,
        acceptedLeaves,
    }
}

// get member details from userid
export const getMemberDetails = async (userId) => {
    const members = await MembersMap();
    if (members.has(userId)) {
        return members.get(userId);
    } else {
        throw USER_DOES_NOT_EXIST;
    }

}

// generate ics file for absences
export const generateIcsFileForAbsences = async () => {
    try {
        const calender = generateCalenderFile();
        const onlyApprovedAbsents = await allAbsenciesApproved();
        onlyApprovedAbsents.forEach(a => addEventToCalender(calender, getEventSummaryBasedOnTypeOfLeave(a.type, a.name), a.memberNote, a.startDate, a.endDate));
        saveCalToFile(calender);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

// format absencees into text to show in browser
export const formatAbsenceesIntoText = (absencees) => {
    var formattedText = ``;
    absencees.forEach(member => {
        formattedText += `${member.name}'s leave plan <br/>`;
        member.absenceList.forEach(leave => {
            formattedText += `- On ${getLeaveType(leave.type)} from ${leave.startDate} to ${leave.endDate} (${DifferenceInPeriods(leave.startDate, leave.endDate, 'days', true)}) Day(s) <br/>`;
        })
    });
    return formattedText;
}

// format user's absencees into text to show in browser
export const formatAbsenceesOfUserIntoText = (details) => {
    var formattedText = ``;
    formattedText += `${details.memberDetails.name}'s leave plan <br/>`;
    details.acceptedLeaves.forEach(leave => {
        formattedText += `- On ${getLeaveType(leave.type)} from ${leave.startDate} to ${leave.endDate} (${DifferenceInPeriods(leave.startDate, leave.endDate, 'days', true)}) Day(s) <br/>`;
    });
    return formattedText;
}

// format all absencees into text to show in browser
export const formatAllLeavePlansIntoText = async () => {
    var formattedText = ``;
    const absencees = await AbsenceeMap();
    const membersMap = await MembersMap();
    Array.from(absencees.keys()).forEach(k => {
        formattedText += `${membersMap.get(k).name}'s leave plan <br/>`;
        absencees.get(k).forEach((leave) => {
            formattedText += `- On ${getLeaveType(leave.type)} from ${leave.startDate} to ${leave.endDate} (${DifferenceInPeriods(leave.startDate, leave.endDate, 'days', true)}) Day(s) ${leave.confirmedAt ? '<span style="color:green">Confirmed</span>': '<span style="color:red">Rejected</span>'} <br/>`;
        });
    });
    return formattedText;
}

// print all leaves in console. this is for command handler
export const printAllLeavePlans = async () => {
    const absencees = await AbsenceeMap();
    const membersMap = await MembersMap();
    Array.from(absencees.keys()).forEach(k => {
        console.log(`${membersMap.get(k).name}'s leave plan`);
        absencees.get(k).forEach((leave) => {
            console.log(`\t`, `On ${getLeaveType(leave.type)} from ${leave.startDate} to ${leave.endDate}`, `(${DifferenceInPeriods(leave.startDate, leave.endDate, 'days', true)}) Day(s)`);
        })
    });
}
