import express, { NextFunction } from 'express';
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
import signoutRouter from './routes/auth/signout';
import getProjectsRouter from './routes/projects';
import getUserRouter from './routes/user';
import imageUploadRouter from './routes/image/upload';
import createProjectRouter from './routes/createProject';
import likeProjectRouter from './routes/likeProject';
import unlikeProjectRouter from './routes/unlikeProject';
import getProjectRouter from './routes/getProject';
import getProjectCommentsRouter from './routes/getProjectComments';
import newCommentProjectRouter from './routes/newCommentProject';
import getUserProfileRouter from './routes/getUserProfile';
import saveProjecteRouter from './routes/saveProject';
import unSaveProjecteRouter from './routes/unSaveProject';
import isProjectSavedRouter from './routes/isProjectSaved';
import updateProjectRouter from './routes/updateProject';
import deleteProjectRouter from './routes/deleteProject';
import searchRouter from './routes/search';
import updateUserRouter from './routes/updateUser';
import updatePasswordRouter from './routes/updatePassword';
import deleteUserRouter from './routes/deleteUser';
import filterTechnologyRouter from './routes/filterTechnology';
import filterCategoryRouter from './routes/filterCategory';
import reportProjectRouter from './routes/reportProject';
import reportCommentRouter from './routes/reportComment';
import reportUserRouter from './routes/reportUser';
import deleteCommentRouter from './routes/deleteComment';
import editCommentRouter from './routes/editComment';
import userAuthRouter from './routes/auth/userAuth';
import projectsTypeRouter from './routes/projectsType';

const app = express()
const port = 5000
const parseJSON = express.json();

app.use(cors({
  origin: ['http://localhost:3000', 'https://evening-spire-06654.herokuapp.com'],
  credentials: true
}));

const parseRequest = (req: any) => {
    return req.url === '/api/login' || 
           req.url === 'api/signup' ? true : false;
};

// disable JSON parser for login/signup routes
app.use((req, res, next) => parseRequest(req) ? parseJSON(req, res, next) : next())

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
app.use('/api/signout/', signoutRouter);
app.use('/api/userAuth', userAuthRouter);

app.use('/api/projects/', getProjectsRouter);
app.use('/api/projects/', projectsTypeRouter);
app.use('/api/user/', getUserRouter);
app.use('/api/user/edit', updateUserRouter);
app.use('/api/image/upload', imageUploadRouter);
app.use('/api/project/new', createProjectRouter);
app.use('/api/project/update', updateProjectRouter);
app.use('/api/project', getProjectRouter);
app.use('/api/project', getProjectCommentsRouter);

app.use('/api/project/like', likeProjectRouter);
app.use('/api/project/unlike', unlikeProjectRouter);
app.use('/api/comment/new', newCommentProjectRouter);
app.use('/api/user/profile', getUserProfileRouter);
app.use('/api/user/profile', getUserProfileRouter);
app.use('/api/user/delete', deleteUserRouter);
app.use('/api/project/save', isProjectSavedRouter);
app.use('/api/project/save', saveProjecteRouter);
app.use('/api/project/unsave', unSaveProjecteRouter);
app.use('/api/project/delete', deleteProjectRouter);
app.use('/api/search', searchRouter);
app.use('/api/password/update', updatePasswordRouter);
app.use('/api/technology', filterTechnologyRouter);
app.use('/api/category', filterCategoryRouter);
app.use('/api/report/project', reportProjectRouter);
app.use('/api/report/comment', reportCommentRouter);
app.use('/api/report/user', reportUserRouter);
app.use('/api/comment/delete', deleteCommentRouter);
app.use('/api/comment/edit', editCommentRouter);


app.listen(process.env.PORT || 5000, () => console.log(`App listening at ${process.env.DOMAIN}:${port}`))