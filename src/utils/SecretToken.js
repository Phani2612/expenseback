import jwt from 'jsonwebtoken';
import { Config } from '../config/config.js';

export const createSecretToken = (id, type) => {
    return jwt.sign({ id }, Config.JWT_SECRET, {
        expiresIn: type === 'refresh' ? Config.REFRESH_TOKEN_EXPIRY : Config.ACCESS_TOKEN_EXPIRY
    });
};
