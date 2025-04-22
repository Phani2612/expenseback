import ApiResponse from '../utils/ApiResponse.utils.js';
import errorHandler from '../middleware/error.middleware.js';
import { Income_Model } from '../model/income.model.js';
import mongoose from 'mongoose';

export const CreateIncome = async (req, res) => {
    const { title, amount, category, date, notes, payment, user_id } = req.body;
    try {
        if (!title || !amount || !category || !date || !payment) {
            return ApiResponse.error(res, 'Details not found', 400);
        }
        if (isNaN(amount) || amount <= 0) {
            return ApiResponse.error(res, 'Amount must be a valid number', 400);
        }
        const AddIncome = await Income_Model.create({ title, amount, category, date, notes, payment, user_id });
        return ApiResponse.success(res, 'Income created successfully', 201);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const getIncomedata = async (req, res) => {
    try {
        const user_id = req.params.uid;
        const Income_data = await Income_Model.find({ user_id });
        if (!Income_data) {
            return ApiResponse.error(res, 'Data not found', 404);
        }
        return ApiResponse.success(res, 'Successfully fetched data', Income_data, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const updateIncome = async (req, res, next) => {
    const income_id = req.params.oid;
    const UpdatedBody = req.body;
    try {
        const updateIncome = await Income_Model.findByIdAndUpdate(income_id, UpdatedBody, { new: true });
        if (!updateIncome) {
            return ApiResponse.error(res, 'Data not found', 404);
        }

        return ApiResponse.success(res, 'Data updated successfully', null, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const deleteIncome = async (req, res, next) => {
    try {
        const IncomeItem = await Income_Model.findOneAndDelete({ _id: req.params.oid });
        if (!IncomeItem) {
            return ApiResponse.error(res, 'Data not found', 404);
        }

        return ApiResponse.success(res, 'Deleted successfully', 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const FilterIncome = async (req, res) => {
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

     

        const incomes = await Income_Model.find({
            user_id: userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        return ApiResponse.success(res, 'Filtered successfully', incomes, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const FilterCategories = async (req, res) => {
    const user_id = req.query.user_id;
    const month = parseInt(req.query.month) - 1 || new Date().getMonth(); // Default to current month (0-11)
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

        const summary = await Income_Model.aggregate([
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
