import { Signup, Login , verifyOTP,Forgot,Reset , Resend , updateUser , getParticularUser, expenseNotifier} from '../controller/user.controller.js';
import express from 'express';
import { upload } from '../utils/cloudinary.js';

const Router = express.Router();

Router.post('/signup', Signup);
Router.post('/login', Login);
Router.post('/verify' , verifyOTP)
Router.post('/resend',Resend)
Router.post('/forgot-password',Forgot)
Router.post('/reset-password/:token/:oid',Reset)
Router.put('/update/:uid' , upload.single('profileImage')  , updateUser)
Router.get('/get/:uid' , getParticularUser)
Router.post('/notify-expense-warning', expenseNotifier )

export default Router;
