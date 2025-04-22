import express from 'express';
import { connectDB } from './src/config/db.js';
import errorHandler from './src/middleware/error.middleware.js';
import ApiResponse from './src/utils/ApiResponse.utils.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './src/route/user.route.js';
import authRoute from './src/route/auth.route.js';
import expenseRoute from './src/route/expense.route.js';
import incomeRoute from './src/route/income.route.js';
import { refreshToken } from './src/controller/refresh.controller.js';
import { agenda } from './src/agenda/agenda.js';
import './src/jobs/recurringExpense.job.js';
import googleroute from './src/route/google.route.js'
import contactroute from './src/route/contact.route.js'

const app = express();
connectDB();
app.use(
    cors({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get('/success', (req, res) => {
    ApiResponse.success(res, 'Test Success', { key: 'value' }, 200);
});

app.get('/error', (req, res) => {
    ApiResponse.error(res, 'Test Error', 500, {
        error: 'Something went wrong'
    });
});


app.use('/api', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/expense', expenseRoute);
app.use('/api/income', incomeRoute);
app.use('/api/google' , googleroute)
app.use('/api/contact' , contactroute)

const AgendaStart = async () => {
    await agenda.start();
    console.log('Agenda started...');

    // Cancel old job schedules if they exist
    await agenda.cancel({ name: 'send recurring expense reminder' });
    await agenda.cancel({ name: 'check and add recurring expenses' });

    console.log('Old recurring jobs cleared.');

    // Schedule the reminder job (1 day before, runs daily at 3:00 AM UTC — which is 8:30 AM IST)
    // await agenda.every('0 3 * * *', 'send recurring expense reminder');
	await agenda.every('45 16 * * *', 'send recurring expense reminder'); //Testing
    console.log('Recurring expense reminder job scheduled at 3:00 AM UTC / 8:30 AM IST...');

    // Schedule the recurring expense job (runs daily at 4:00 AM UTC — 9:30 AM IST)
    await agenda.every('0 4 * * *', 'check and add recurring expenses');
    console.log('Recurring expense job scheduled at 4:00 AM UTC / 9:30 AM IST...');
};

AgendaStart();



app.use(errorHandler);
app.listen(5000, () => {
    console.log('Port is running at 5000');
});
