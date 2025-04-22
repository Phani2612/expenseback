import express from 'express';
import { CreateIncome ,getIncomedata , updateIncome , deleteIncome , FilterIncome , FilterCategories} from '../controller/income.controller.js';

const Router = express.Router();

Router.post('/add', CreateIncome);
Router.get('/fetch/:uid' , getIncomedata)
Router.put('/update/:oid' , updateIncome)
Router.delete('/delete/:oid' , deleteIncome)
Router.get('/filter/timeline' , FilterIncome)
Router.get('/category-summary' , FilterCategories)

export default Router;
