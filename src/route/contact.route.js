import express from 'express';
import { SendMessage } from '../controller/contact.controller.js';

const Router = express.Router();

Router.post('/message', SendMessage);

export default Router;
