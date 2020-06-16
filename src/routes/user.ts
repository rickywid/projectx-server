import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:id', function (req, res, next) {
  
  
  /* 
  User Sign Up
  If user signup is successful, localStorage will store user's id.
  User will be redirected "/" root component and will fetch user data using user id stored in localStorage.

  User Login
  If user logs in via email/pass or Github, user will be redirected to "/" if successful. userID in localStorage will be empty 
  and default value of 0 will be passed as user_id parameter in client side side fetch request.
  */
  

  const params = parseInt(req.params.id);

  // if params is 0, user was redirected to "/" after successful signup. get user's profile using user's id in url parameter.
  if(params) {
    db.query(`SELECT * FROM users WHERE id = $1`, [params], (err: any, result: any) => {
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