import {google} from 'googleapis'
import { Config } from '../config/config.js'

export const oauth2Client = new google.auth.OAuth2(
    Config.CLIENT_ID,
    Config.CLIENT_SECRET,
    Config.REDIRECT_URL
)

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email'
];

export const generateAuthUrl=()=>{
    
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        redirect_uri: "http://localhost:5000/api/google/auth/google/callback"
      
    });
}

export const setCredentials = (tokens)=>{
    oauth2Client.setCredentials(tokens);
}

