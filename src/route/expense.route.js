import express from 'express';
import { CreateExpense , getExpensedata , updateExpense ,deleteExpense , FilterExpense , ExpenseEventCreator , FilterCategories} from '../controller/expense.controller.js';

const Router = express.Router();

Router.post('/add', CreateExpense);
Router.get('/fetch/:uid',getExpensedata)
Router.put('/update/:oid' , updateExpense)
Router.delete('/delete/:oid' , deleteExpense)
Router.get('/filter/timeline' , FilterExpense)
Router.post('/event' , ExpenseEventCreator)
Router.get('/category-summary' ,FilterCategories)

export default Router;
