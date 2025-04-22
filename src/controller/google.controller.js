import { oauth2Client, generateAuthUrl, setCredentials } from '../services/googleAuthService.js';
import ApiResponse from '../utils/ApiResponse.utils.js';
import { User_Model } from '../model/User.model.js';
import { google } from 'googleapis';
import { Config } from '../config/config.js';

export const handleGoogleLogin = (req, res) => {
    const url = generateAuthUrl();
    res.redirect(url);
};

export const handleGoogleCallback = async (req, res) => {
    try {
        const { code, state } = req.query;

        // Exchange the code for access and refresh tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Use the access token to get user info (including email)
        const oauth2 = google.oauth2({
            version: 'v2',
            auth: oauth2Client
        });

        // Fetch user info (email, name, etc.)
        const userInfo = await oauth2.userinfo.get();

        // Now, you can access the user's email
        const userEmail = userInfo.data.email;

        // Example: Find the user by email and update their google-related data
        const user = await User_Model.findOneAndUpdate(
            { email: userEmail }, // Find user by email
            {
                'google.accessToken': tokens.access_token,
                'google.refreshToken': tokens.refresh_token,
                'google.tokenType': tokens.token_type,
                'google.expiryDate': tokens.expiry_date
            },
            { new: true } // Return the updated user object
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Redirect to frontend after successful login
        res.redirect(`${Config.FRONT_END}/dashboard/expense`);
    } catch (error) {
        res.status(500).send('Error in Google callback');
    }
};

export const CheckGoogleAuthStatus = async (req, res) => {
    try {
        const user = await User_Model.findById(req.params.uid);

        if (!user) {
            return ApiResponse.error(res, 'User not found', 404);
        }

        if (user && user.google && user.google.accessToken) {
            return ApiResponse.success(res, 'authourized access', 200);
        } else {
            return ApiResponse.error(res, 'unauthourized access', 401);
        }
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};
