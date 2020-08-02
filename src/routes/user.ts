import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/', function (req, res, next) {
  
  
  /* 
  After successfull login/signup, this route will be called to fetch user data.

  User Sign Up
  If user signup is successful, get the user's ID from req.sessions.userID.

  User Login
  If user logs in via email/pass or Github, get user's ID from Passport's req.user.id object.
  */
  
  if(req.session!.authenticated) {
    db.query(`SELECT * FROM users WHERE id = $1`, [req.session!.userID], (err: any, result: any) => {
      if(err) console.log(err)

      const user = result.rows[0];
      const { id, username, gh_avatar } = user as any;

      return res.send({
        data: {id, username, gh_avatar, isAuthenticated: true },
      })
    })
  } else {

    // user was redirected to "/" after successful login via email/pass or github. get user's id from passport's req.user object
    const isAuthenticated = req.isAuthenticated();
    if(req.isAuthenticated()) {
      const { id, username, gh_avatar } = req.user as any;
      
      return res.send({
        data: {id, username, gh_avatar, isAuthenticated },
      })
    } else {
      return res.send({
        data: { isAuthenticated },
      })
    }
  }
});

export default router;