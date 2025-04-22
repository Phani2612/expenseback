import { config } from 'dotenv';
config();
export const Config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
    NODE_ENV: process.env.NODE_ENV,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    NODE_MAILER_USER: process.env.NODE_MAILER_USER,
    NODE_MAILER_PASSWORD: process.env.NODE_MAILER_PASSWORD,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_API_KEY: process.env.CLIENT_API_KEY,
    REDIRECT_URL: process.env.REDIRECT_URL,
    FRONT_END: process.env.FRONT_END,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};
