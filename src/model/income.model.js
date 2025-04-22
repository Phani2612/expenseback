import mongoose from 'mongoose';

const Income_Schema = new mongoose.Schema(
    {
        user_id : {type : mongoose.Schema.Types.ObjectId, ref:'user_tables' , index : true},
        title: { type: String },
        amount: { type: Number },
        category: { type: String },
        payment: { type: String },
        date: { type: Date },
        notes: { type: String },
        type : {type:String , default:'Income'}
    },
    { timestamps: true }
);

export const Income_Model = mongoose.model('Income_Model', Income_Schema);
