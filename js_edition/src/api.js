import fs from 'fs';
import path from 'path';

const ABSENCES_PATH = path.join(__dirname, 'json_files', 'absences.json');
const MEMBERS_PATH = path.join(__dirname, 'json_files', 'members.json');

const readJsonFile = (path) => new Promise((resolve) => fs.readFile(path, 'utf8', (_, data) => resolve(data)))
  .then((data) => JSON.parse(data))
  .then((data) => data.payload);

export const members = () => readJsonFile(MEMBERS_PATH);
export const absences = () => readJsonFile(ABSENCES_PATH);

export const MembersMap = async () => {
  var membersMap = new Map();
  const allMembers = await members();
  allMembers.forEach(entry => membersMap.set(entry.userId, entry));
  return membersMap;
}

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

export const AbsenceesListWithMemberName = async () => {
  console.log("testing 1");
  var memberMap = await MembersMap();
  console.log("222222", memberMap.get(644));
  const allAbsences = await absences();
  console.log(allAbsences, "111111111");
  allAbsences.forEach(a => a.name = memberMap.get(a.userId));  
  console.log(allAbsences, "222222");
  return allAbsences;
}