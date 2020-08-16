import express from 'express';
import path from 'path';
import { getAbsenceesInDateRange, getAllAbsencees, generateIcsFileForAbsences, formatAbsenceesIntoText, formatAbsenceesOfUserIntoText, formatAllLeavePlansIntoText, getAbsenceesOfAUser } from '../services/LeaveManagement'

const app = express()
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    res.send(`
        Crewmeister coding challenge <br/>
        <br/>
        <br/>
        APIs: <br/>
        1. Get Users leave plan from user id ( Only approved leaves ). Click => <a target="_blank" href="http://localhost:3000/user?userId=644"> Leave Plan for userId 644 </a> <br/>
        2. Get leave plan for all users ( Both approved and rejected leaves ). Click => <a target="_blank" href="http://localhost:3000/allAbsences"> Leave Plan for all users </a> <br/>
        3. Get leave plan for all in date range ( Only approved leaves ). Click => <a target="_blank" href="http://localhost:3000/dateRange?startDate=2017-01-01&endDate=2017-02-01"> Leave Plan for all users in range 1 Jan 2017 to 1 Feb 2017</a> <br/>
        4. Download ical file. Click => <a target="_blank" href="http://localhost:3000/downloadCalender"> Download ical file for all absencees</a> <br/>

        <br/>
        <br/>
        Command line tool: <br/>
        You can also use your terminal to get list of all leave plans. Follow below steps to get it. <br/>
        1. Keep "npx nodemon" running in separate terminal. <br/>
        2. Open your preferred terminal. <br/>
        3. run command => <b> cd "${path.join(__dirname, '../../')}" </b><br/>
        4. run command =>  <b> "npm run all-absencees" </b>  <br/>
    `)
});
app.get('/downloadCalender', async (req, res) => {
    try {
        await generateIcsFileForAbsences();
        res.download(path.join(__dirname, '../../leavePlan.ics'), 'leavePlan.ics');
    } catch (e) {
        res.send(e);
    }
})
app.get('/user', async (req, res) => {
    try {
        if (req.query.userId) {
            var response = await getAbsenceesOfAUser(parseInt(req.query.userId));
            const formattedResponse = formatAbsenceesOfUserIntoText(response);
            res.send(formattedResponse);
        } else {
            res.send({
                success: false,
                message: "Please send valid user Id"
            })
        }
    } catch (e) {
        res.send(e);
    }
});

app.get('/dateRange', async (req, res) => {
    try {
        if (req.query.startDate && req.query.endDate) {
            var response = await getAbsenceesInDateRange(req.query.startDate, req.query.endDate);
            var formatedResponse = formatAbsenceesIntoText(response);
            res.send(formatedResponse);
        } else {
            res.send({
                success: false,
                message: "Please send valid dates"
            });
        }
    } catch (e) {
        res.send(e);
    }

});

app.get("/allAbsences", async (req, res) => {
    const response = await formatAllLeavePlansIntoText();
    res.send(response);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
