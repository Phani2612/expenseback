import mongoose, { Schema } from 'mongoose';

const Contact_Schema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true }
} , { timestamps: true });

export const Contact_Model = mongoose.model('contact_model' , Contact_Schema)

