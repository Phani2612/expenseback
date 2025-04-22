import jwt from 'jsonwebtoken';
import { Config } from '../config/config.js';
import ApiResponse from '../utils/ApiResponse.utils.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    

    if (!token) {
        return ApiResponse.error(res, 'No token Provided', 401);
    }

    jwt.verify(token, Config.JWT_SECRET, (err, user) => {
        if (err) {
          
            return ApiResponse.error(res, 'Invalid or expired token ', 403);
        }
        req.user = user;
        next();
    });
};
