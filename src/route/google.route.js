import express from 'express'
import { handleGoogleCallback , handleGoogleLogin , CheckGoogleAuthStatus } from '../controller/google.controller.js'
const Router = express.Router()

Router.get('/auth/google', handleGoogleLogin);
Router.get('/auth/google/callback', handleGoogleCallback);
Router.get('/auth/google-auth-status/:uid' , CheckGoogleAuthStatus)

export default Router