import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { refreshToken } from '../controller/refresh.controller.js';
import { VerifyToken } from '../controller/verify.controller.js';

const Router = express.Router();

Router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this route!', user: req.user });
});

Router.get('/protection', (req, res) => {
    res.json({ message: 'You have access to this route!', user: req.user });
});

Router.post('/refresh', refreshToken);
Router.get('/verify-token',VerifyToken)

export default Router;
