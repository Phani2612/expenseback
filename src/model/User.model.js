import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Your email address is required'],
            index : true,
            unique: true
        },

        username: {
            type: String,
            required: [true, 'Your username is required']
        },

        password: {
            type: String,
            required: [true, 'Your password is required']
        },

        isAdmin: { type: Boolean, default: false },
        google: {
            accessToken: String,
            refreshToken: String,
            scope: String,
            tokenType: String,
            expiryDate: Number
          },
        
        website : {type:String},
        linkedIn : {type:String},
        profileImage : {type:String},
        lastExpenseWarningDate: { type: Date, default: null }, 
    },
    { timestamps: true }
);

UserSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

export const User_Model = mongoose.model('user_table', UserSchema);
