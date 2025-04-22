import {google} from 'googleapis'
import oauth2Client from './googleAuthService.js'

async function createCalendarEvent(userTokens, expense) {
    oauth2Client.setCredentials(userTokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: `Upcoming Expense: ${expense.title}`,
        description: `Reminder: ${expense.description}`,
        start: {
            dateTime: expense.dueDate.toISOString(),
            timeZone: 'Asia/Kolkata'
        },
        end: {
            dateTime: new Date(new Date(expense.dueDate).getTime() + 30 * 60000).toISOString(),
            timeZone: 'Asia/Kolkata'
        }
    };

    return await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });
}


export default createCalendarEvent