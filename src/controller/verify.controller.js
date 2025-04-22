import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/ApiResponse.utils.js';
import { Config } from '../config/config.js';

export const VerifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return ApiResponse.error(res, 'Token not provided', 401);
        }

        jwt.verify(token, Config.JWT_SECRET, (err, decoded) => {
            const refreshToken = req.cookies.refreshToken;

            if (err) {
                if (!refreshToken) {
                    return ApiResponse.error(res, 'No refresh token. Please login again.', 403);
                }

                return ApiResponse.error(res, 'Token expired or invalid', 403); // frontend will handle refresh
            }

            if (!refreshToken) {
                return ApiResponse.error(res, 'Refresh token missing. Please login again.', 403);
            }

            req.user = decoded;
            return ApiResponse.success(res, 'The Token is valid', 200);
        });
    } catch (error) {
        return ApiResponse.error(res, 'Internal server error', 500);
    }
};
