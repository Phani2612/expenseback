import nodemailer from 'nodemailer';
import { Config } from '../config/config.js';

export const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: Config.NODE_MAILER_USER,
            pass: Config.NODE_MAILER_PASSWORD
        }
    });
};
