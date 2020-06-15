import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Pool } from 'pg';
var pgSession = require('connect-pg-simple')(session);

import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();

import githubAuthRouter from './routes/auth/github/github-auth';
import githubAuthCallbackRouter from './routes/auth/github/callback';
import loginRouter from './routes/auth/login';
import signupRouter from './routes/auth/signup';
import getUserRouter from './routes/user';


const app = express()
const port = 5000

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    store: new pgSession({
        pool : new Pool({
          user: process.env.DB_USER, 
          password: process.env.DB_PASS,
          host: process.env.DB_HOSTNAME, 
          database: process.env.DB_NAME
        })
      }),
    secret: 'blkj4h3kj34hk34',
    cookie: { secure: false }
}));



app.use(passport.initialize());
app.use(passport.session());

// auth routes
app.use('/api/auth/github', githubAuthRouter);
app.use('/api/auth/github/callback', githubAuthCallbackRouter);
app.use('/api/login/', loginRouter);
app.use('/api/signup/', signupRouter);

app.use('/api/user/', getUserRouter);


console.log(process.env.GITHUB_CLIENT_ID)


app.listen(process.env.PORT || 5000, () => console.log(`Example app listening at http://localhost:${port}`))