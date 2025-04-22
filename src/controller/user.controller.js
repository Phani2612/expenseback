import { User_Model } from '../model/User.model.js';
import { createSecretToken } from '../utils/SecretToken.js';
import bcrypt from 'bcrypt';
import ApiResponse from '../utils/ApiResponse.utils.js';
import { Config } from '../config/config.js';
import { OTPGen } from '../helper/OTPgenerator.js';
import { SENDMAIL } from '../utils/mailer.js';
import { ResetPasswordMail } from '../utils/mailer.js';
import jwt from 'jsonwebtoken';
import { LimitNotification } from '../utils/mailer.js';

const OTPcache = {};
export const Signup = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const existingUser = await User_Model.findOne({ email });
        if (existingUser) {
            return ApiResponse.error(res, 'User already exists', 409);
        }
        // const user = await User_Model.create({ email, password, username });
        const OTP = OTPGen();
        OTPcache[email] = { otp: OTP, expiresAt: Date.now() + 5 * 60 * 1000 };

        let Sendmail = await SENDMAIL(email, OTP);
        return ApiResponse.success(res, 'OTP sent to email', { email, password, username }, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const Resend = async (req, res) => {
    try {
        const { email } = req.body;
        const userExists = await User_Model.findOne({ email });
        if (userExists) {
            return ApiResponse.error(res, 'User already exists', 409);
        }
        const OTP = OTPGen();
        OTPcache[email] = { otp: OTP, expiresAt: Date.now() + 5 * 60 * 1000 };
        let sendmail = await SENDMAIL(email, OTP);

        return ApiResponse.success(res, 'OTP sent successfully', 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp, password, username } = req.body;
        if (!OTPcache[email]) return ApiResponse.error(res, 'OTP not found', 404);

        const { otp: storedOtp, expiresAt } = OTPcache[email];
        if (expiresAt < Date.now()) {
            delete OTPcache[email]; // Remove expired OTP
            return ApiResponse.error(res, 'OTP expired', 400);
        }

        if (storedOtp !== otp) return ApiResponse.error(res, 'Invalid OTP', 400);

        delete OTPcache[email];
        const user = await User_Model.create({ email, password, username });
        return ApiResponse.success(res, 'OTP verified successfully', {}, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await User_Model.findOne({ email });
        if (!user) {
            return ApiResponse.error(res, 'Usesr not found', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return ApiResponse.error(res, 'Incorrect password', 401);
        }

        const accessToken = createSecretToken(user._id, 'access');
        const refreshToken = createSecretToken(user._id, 'refresh');
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: Config.NODE_ENV,
            sameSite: 'strict'
        });

        return ApiResponse.success(res, 'Login successful', { accessToken, user }, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const Forgot = async (req, res, next) => {
    try {
        const { email } = req.body;
        const userExists = await User_Model.findOne({ email });
        if (!userExists) {
            return ApiResponse.error(res, 'user not found', 404);
        }

        const ResetToken = createSecretToken(email, 'access');
        const ResetMail = await ResetPasswordMail(email, ResetToken);
        return ApiResponse.success(res, 'Email sent successfully', null, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const Reset = async (req, res) => {
    try {
        const { token, oid } = req.params;
        const { password } = req.body;

        if (!token) {
            return ApiResponse.error(res, 'No token provided', 401);
        }

        
        // 1. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, Config.JWT_SECRET);
        } catch (err) {
            return ApiResponse.error(res, 'Invalid or expired token', 403);
        }

        // 2. Find user by decoded.id or email
        const user = await User_Model.findById({ _id: oid });
        if (!user) {
            return ApiResponse.error(res, 'User not found', 404);
        }

        // 3. Assign new password (pre-save hook will hash it)
        user.password = password;
        await user.save();

        return ApiResponse.success(res, 'Password reset successful', null, 200);
    } catch (error) {
      
        return ApiResponse.error(res, error.message, 500);
    }
};

export const updateUser = async (req, res) => {
    const user_id = req.params.uid;
    const UpdatedBody = req.body;

    if (req.file) {
        
        UpdatedBody.profileImage = req.file.path || req.file.url || req.file.secure_url;
    }

    // Fix: Parse if google is JSON string
    if (typeof UpdatedBody.google === 'string') {
        try {
            UpdatedBody.google = JSON.parse(UpdatedBody.google);
        } catch (error) {
            
            return ApiResponse.error(res, 'Invalid google data format', 400);
        }
    }

    if (UpdatedBody.lastExpenseWarningDate === 'null' || UpdatedBody.lastExpenseWarningDate === '') {
        UpdatedBody.lastExpenseWarningDate = null;
    }
    

    try {
        const UpdateUser = await User_Model.findByIdAndUpdate(user_id, UpdatedBody, { new: true });

        if (!UpdateUser) {
            return ApiResponse.error(res, 'Data not found', 404);
        }

        return ApiResponse.success(res, 'Data updated successfully', 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const getParticularUser = async (req, res) => {
    const user_id = req.params.uid;

    try {
        const User_Data = await User_Model.findById(user_id);

        if (!User_Data) {
            return ApiResponse.error(res, 'user not found', 404);
        }

        return ApiResponse.success(res, 'Successfully fetched', User_Data, 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};

export const expenseNotifier = async (req, res) => {
    try {
        const { email, username, expense, income } = req.body;

        

        // Validate required fields
        if (!email || !username || expense == null || income == null) {
            return ApiResponse.error(res, 'Missing required fields', 400);
        }

        // Find user in the database
        const user = await User_Model.findOne({ email });
        if (!user) {
            return ApiResponse.error(res, 'User not found', 404);
        }

        // Get the current month (0-11, where 0 is January, 11 is December)
        const currentMonth = new Date().getMonth();

        // Check if the user has been notified before (if 'lastExpenseWarningDate' is null)
        const lastNotifiedDate = user.lastExpenseWarningDate;
        const lastNotifiedMonth = lastNotifiedDate ? new Date(lastNotifiedDate).getMonth() : null;


        // Define the threshold percentage for "nearing" the income (e.g., 90%)
        const thresholdPercentage = 0.9;

        // Calculate if the expense is nearing the income
        const isExpenseNearingIncome = expense >= income * thresholdPercentage;

        // Trigger email if expense is nearing income (based on the threshold) and the email has not been sent this month
        if (isExpenseNearingIncome && (lastNotifiedMonth === null || lastNotifiedMonth !== currentMonth)) {
            

            // Call the LimitNotification function to send the email
            await LimitNotification(email, user.username, expense, income); // send email

            // Update the 'lastExpenseWarningDate' in the user's record
            user.lastExpenseWarningDate = new Date(); // Set the current date as the last notification date
            await user.save();

            return ApiResponse.success(res, 'Notification sent', 200);
        } else {
           
            return res.json({ success: true, message: 'No notification needed.' });
        }
    } catch (error) {
       
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};
