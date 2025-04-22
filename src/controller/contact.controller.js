import { Contact_Model } from '../model/contact.model.js';
import { User_Model } from '../model/User.model.js';
import ApiResponse from '../utils/ApiResponse.utils.js';
import { ContactNotification } from '../utils/mailer.js';

export const SendMessage = async (req, res) => {
    const { email, phone, subject, message , username} = req.body;
    try {
        const FindUser = await User_Model.findOne({ email });
        if (!FindUser) {
            return ApiResponse.error(res, 'User not found in our database', 404);
        }

        const Submit = await Contact_Model.create({ email, phone, subject, message });
        await ContactNotification(email , username , subject , message)
        return ApiResponse.success(res, 'Submitted message successfully', 200);
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500, error);
    }
};
