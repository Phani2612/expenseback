import ApiResponse from '../utils/ApiResponse.utils.js';
import { Expense_Model } from '../model/expense.model.js';
import mongoose from 'mongoose';
import { User_Model } from '../model/User.model.js';
import { google } from 'googleapis';
import { oauth2Client } from '../services/googleAuthService.js';

export const CreateExpense = async (req, res) => {
    const { title, amount, category, date, notes, user_id, enddate, isActive, frequency } = req.body;
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken || !refreshToken) {
            return ApiResponse.error(res, 'Tokens not found', 403);
        }

        if (!title || !amount || !category || !date) {
            return ApiResponse.error(res, 'Details not found', 400);
        }
        if (isNaN(amount) || amount <= 0) {
            return ApiResponse.error(res, 'Amount must be a valid number', 400);
        }
        const AddExpense = await Expense_Model.create({ title, amount, category, date, notes, user_id, isActive, enddate, frequency });

        return ApiResponse.success(res, 'Expense created successfully', 201);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const getExpensedata = async (req, res) => {
    try {
        const user_id = req.params.uid;
        const Expense_data = await Expense_Model.find({ user_id });
        if (!Expense_data) {
            return ApiResponse.error(res, 'Data not found', 404);
        }
        return ApiResponse.success(res, 'successfully fetched data', Expense_data, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const updateExpense = async (req, res, next) => {
    const expense_id = req.params.oid;
    const UpdatedBody = req.body;

    try {
        const updateExpense = await Expense_Model.findByIdAndUpdate(expense_id, UpdatedBody, { new: true });
        if (!updateExpense) {
            return ApiResponse.error(res, 'Data not found', 404);
        }

        return ApiResponse.success(res, 'Data updated successfully', null, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const deleteExpense = async (req, res, next) => {
    try {
        const ExpenseItem = await Expense_Model.findOneAndDelete({ _id: req.params.oid });
        if (!ExpenseItem) {
            return ApiResponse.error(res, 'Data not found', 404);
        }

        return ApiResponse.success(res, 'Deleted successfully', 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const FilterExpense = async (req, res) => {
    const { userId, type, value } = req.query;

    if (!userId || !type || !value) {
        return ApiResponse.error(res, 'Input fields missing', 400);
    }

    try {
        let startDate, endDate;

        const currentDate = new Date(value);

        switch (type) {
            case 'Month':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
            case 'Year':
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear(), 11, 31);
                break;
            case 'Week':
                const day = currentDate.getDay();
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - day);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                break;
            default:
                return ApiResponse.error(res, 'Not found', 404);
        }

        const expenses = await Expense_Model.find({
            user_id: userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        return ApiResponse.success(res, 'Filtered successfully', expenses, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};



export const FilterCategories = async (req, res) => {
    const user_id = req.query.user_id;
    const month = parseInt(req.query.month)-1 || new Date().getMonth(); // Default to current month (0-11)
    const year = parseInt(req.query.year) || new Date().getFullYear(); // Default to current year

    if (!user_id) {
        return ApiResponse.error(res, 'User Id not sent', 400);
    }

    let startDate, endDate;

    try {
        // Calculate the start date (first day of the month)
        // Set the start and end date to be midnight for the start of the month and 23:59:59.999 for the end of the month
        startDate = new Date(Date.UTC(year, month, 1)); // First day of the month in UTC
        endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // Last day of the month in UTC

       

        const summary = await Expense_Model.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(user_id),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category', // Group by category
                    TotalAmount: { $sum: '$amount' } // Sum the amounts
                }
            }
        ]);

        

        return ApiResponse.success(res, 'Successfully filtered', summary, 200);

    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};



export const ExpenseEventCreator = async (req, res) => {
    try {
        const { title, date, enddate, user_id, frequency, _id } = req.body;

        const user = await User_Model.findById(user_id);
        if (!user) return ApiResponse.error(res, 'User not found', 404);

        const authClient = await ensureValidGoogleTokens(user);
        const calendar = google.calendar({ version: 'v3', auth: authClient });

        const expense = await Expense_Model.findById(_id);

        if (expense.isEventCreated) {
            return ApiResponse.error(res, 'Calendar event already created for this expense', 400);
        }

        const event = {
            summary: title,
            description: 'Expense Event',
            start: { dateTime: new Date(date).toISOString(), timeZone: 'UTC' },
            end: { dateTime: new Date(enddate).toISOString(), timeZone: 'UTC' }
        };

        const recurrence = getRecurrenceRule(frequency , enddate);
        if (recurrence) {
            event.recurrence = recurrence;
        }

        // Call Google Calendar API
        const calendarResponse = await calendar.events.insert({
            calendarId: 'primary',
            resource: event
        });

        if (calendarResponse && calendarResponse.data && calendarResponse.data.id) {
            // Update database only after successful Google response
            expense.isEventCreated = true;
            expense.googleEventId = calendarResponse.data.id;
            await expense.save();

            return ApiResponse.success(res, 'Event created successfully', calendarResponse.data, 200);
        } else {
            return ApiResponse.error(res, 'Failed to create event with Google Calendar', 500);
        }
    } catch (error) {
        
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

const getRecurrenceRule = (frequency, enddate) => {
    const formattedEndDate = new Date(enddate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    switch (frequency) {
        case 'Daily':
            return [`RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=${formattedEndDate}`];
        case 'Weekly':
            return [`RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=${formattedEndDate}`];
        case 'Monthly':
            return [`RRULE:FREQ=MONTHLY;INTERVAL=1;UNTIL=${formattedEndDate}`];
        case 'yearly':
            return [`RRULE:FREQ=YEARLY;INTERVAL=1;UNTIL=${formattedEndDate}`];
        default:
            return null;
    }
};

export const ensureValidGoogleTokens = async user => {
    if (!user || !user.google || !user.google.accessToken) {
        throw new Error('Google not connected for this user.');
    }

    // Set initial credentials
    oauth2Client.setCredentials({
        access_token: user.google.accessToken,
        refresh_token: user.google.refreshToken
    });

    try {
        // Attempt to get a valid access token
        const tokenInfo = await oauth2Client.getAccessToken();

        if (!tokenInfo || !tokenInfo.token) {
            // If token is invalid or missing, refresh manually
            const { credentials } = await oauth2Client.refreshAccessToken();
            oauth2Client.setCredentials(credentials);

            // Save refreshed tokens to DB
            await User_Model.findByIdAndUpdate(user._id, {
                'google.accessToken': credentials.access_token,
                'google.refreshToken': credentials.refresh_token || user.google.refreshToken,
                'google.expiryDate': credentials.expiry_date
            });
        }

        return oauth2Client;
    } catch (error) {
        
        throw new Error('Google token validation failed.');
    }
};
// Dyanmic dropdownlist in front end can be done making get request here
// const earliest = await ExpenseModel.findOne().sort({ date: 1 });
// const latest = await ExpenseModel.findOne().sort({ date: -1 });
