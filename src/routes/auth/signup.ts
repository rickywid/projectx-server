import express from 'express';
import formidable from 'formidable';
import bcrypt from 'bcrypt-nodejs';
import db from '../../lib/db';
import mailer from "../../lib/mailer";

const router = express.Router();


router.post('/', (req, res, next) => {
  
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => { 

    const { username, email, password, profile_img } = fields;

    // check if username already exists
    db.query(`
    SELECT * 
    FROM users
    WHERE username = $1;
    `, [username], (err: any, result: any) => {
    
    if (err) console.log(err)
    if(result.rows.length > 0) return res.status(400).send({
      status: "error",
      message: "username already taken"
    });

    // check if email already exists
    db.query(`
      SELECT * 
      FROM users
      WHERE email = $1;
    `, [email], (err: any, result: any) => {

        if (err) console.log(err)
        if(result.rows.length > 0) return res.status(400).send({
          status: 'error',
          message: "email already taken"
        });

          // create new user
          // generate salt
          // hash(encrypt) our password using the salt
          // execute sql query 
          bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(password as string, salt, null, async (err, hash) => {

            if (err) console.log(err);

            db.query(`
              INSERT INTO users (username, email, password, gh_avatar)
              VALUES ($1, $2, $3, $4) RETURNING id, username;
            `, [username, email, hash, profile_img], (err: any, result: any) => {

              if (err) console.log(err);

              mailer(
                'New User Signup',
                `${username} has signed up to CodeConcept.`
                ).catch(console.error);              

              // create session data only when new user signs up in order to fetch user data.
              req.session!.userID = result.rows[0].id;
              req.session!.username = result.rows[0].username;
              req.session!.authenticated = true;
              
              return res.status(200).send({
                status: "ok",
                id: result.rows[0].id}
              ); 
            });
          });
        });
      });
    });
  });
});


export default router;




