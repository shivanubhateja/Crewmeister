import fs from 'fs';
import path from 'path';

const ABSENCES_PATH = path.join(__dirname, 'json_files', 'absences.json');
const MEMBERS_PATH = path.join(__dirname, 'json_files', 'members.json');

const readJsonFile = (path) => new Promise((resolve) => fs.readFile(path, 'utf8', (_, data) => resolve(data)))
  .then((data) => JSON.parse(data))
  .then((data) => data.payload);

export const members = () => readJsonFile(MEMBERS_PATH);
export const absences = () => readJsonFile(ABSENCES_PATH);

// creating map with userid as key of the map, making easy to get details of user using user's userid
export const MembersMap = async () => {
  var membersMap = new Map();
  const allMembers = await members();
  allMembers.forEach(entry => membersMap.set(entry.userId, entry));
  return membersMap;
}

// creating map with key as userId, to make it easy to retrive data for a particular user
export const AbsenceeMap = async () => {
  var absenceeMap = new Map();
  const allAbsences = await absences();
  allAbsences.forEach(absenceEntry => {
      if(!absenceeMap.has(absenceEntry.userId)) {
          absenceeMap.set(absenceEntry.userId, [ absenceEntry ]);
      } else {  
          absenceeMap.set(absenceEntry.userId, [...absenceeMap.get(absenceEntry.userId), absenceEntry])
      }    
  });    
  return absenceeMap;
}  

// plain list of absences from absencees.json with name of member
export const AbsenceesListWithMemberName = async () => {
  var memberMap = await MembersMap();
  const allAbsences = await absences();
  allAbsences.forEach(a => a.name = memberMap.get(a.userId).name);  
  return allAbsences;
}