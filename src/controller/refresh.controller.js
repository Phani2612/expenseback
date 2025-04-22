import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/ApiResponse.utils.js';
import { Config } from '../config/config.js';
import { createSecretToken } from '../utils/SecretToken.js';

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    
    if (!refreshToken) {
        return ApiResponse.error(res, 'No refreshtoken provided', 403);
    }
    jwt.verify(refreshToken, Config.JWT_SECRET, (err, user) => {
        if (err) {
            return ApiResponse.error(res, 'Invalid refresh token', 403);
        }

        const accessToken = createSecretToken(user.id);
       
        return ApiResponse.success(res, 'Access token generated', accessToken, 200);
    });
};

