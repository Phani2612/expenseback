import nodemailer from 'nodemailer';
import { Config } from '../config/config.js';
import HTML_TEMPLATE from './mail-template.js';
import EXPENSE_MAIL_TEMPLATE from './expense-template.js';
import ApiResponse from './ApiResponse.utils.js';
import { LimitNotificationTemplate } from './limitnotificationtemplate.js';
import { getTransporter } from './mailerConfig.js';
import generateContactConfirmationEmail from './contact-template.js';

export const SENDMAIL = async (email, otp) => {
    try {
        const transporter = getTransporter();
        const message = `Your OTP for registration is OTP:${otp}`;
        const mailOptions = {
            from: Config.NODE_MAILER_USER,
            to: email,
            subject: 'Your OTP Verification Code',
            html: HTML_TEMPLATE(message)
        };
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to send OTP' };
    }
};

export const ResetPasswordMail = async (email, ResetToken) => {
    try {
        const transporter = getTransporter();
        const message = `The reset password link: <a href="${Config.FRONT_END}/reset/${ResetToken}">Click here to reset your password</a>`;
        const mailOptions = {
            from: Config.NODE_MAILER_USER,
            to: email,
            subject: 'Your password reset link',
            html: HTML_TEMPLATE(message)
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to send reset link' };
    }
};

export const RecurringNotify = async (email, username, expense ) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toLocaleDateString(); // You can format it as required (e.g., 'MM/DD/YYYY')

    try {
        const transporter = getTransporter();

        const mailOptions = {
            from: Config.NODE_MAILER_USER,
            to: email,
            subject: 'Your Auto recurring expense',
            html: EXPENSE_MAIL_TEMPLATE(username, expense, dueDate)
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to send email' };
    }
};

export const LimitNotification = async (email, username, expense, income) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: Config.NODE_MAILER_USER,
            to: email,
            subject: '⚠️ Expense Limit Alert: Watch Your Spending!',
            html: LimitNotificationTemplate(username, expense, income)
        };
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to send email' };
    }
};

export const ContactNotification = async (email, username, summary, message) => {
    console.log(email , username , summary , message)
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: Config.NODE_MAILER_USER,
            to: email,
            subject: 'Thank you for contacting us!',
            html: generateContactConfirmationEmail(username, summary, message)
        };
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to send email' };
    }
};
