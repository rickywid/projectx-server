import express from 'express';
import passport from 'passport';
import '../../../../lib/passport';

const router = express.Router();


interface IFields {
	username: string;
	password: string;
  }

router.get('/', passport.authenticate('github'), function (req, res, next) {
    console.log('callback')
    console.log(req.session)
    console.log(req.user)
      // res.setHeader('Set-Cookie', [ 
      //     cookie.serialize('token', generateToken(req.user.username), cookieHeader),
      //     cookie.serialize('userID', req.user.id, cookieHeader) ,
      //     cookie.serialize('login', req.user.username, cookieHeader) 
      //   ]);
      res.redirect(`http://localhost:3000`)
});


export default router;