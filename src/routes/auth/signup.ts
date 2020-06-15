import express from 'express';
import passport from 'passport';
import formidable from 'formidable';
import bcrypt from 'bcrypt-nodejs';
import db from '../../lib/db';
const router = express.Router();


router.post('/', (req, res, next) => {
  
  const { username, email, password } = req.body;

  // check if username already exists
  db.query(`
  SELECT * 
  FROM users
  WHERE username = $1;
  `, [username], (err: any, result: any) => {
  
  if (err) console.log(err)
  if(result.rows.length > 0) return res.status(400).send({message: "username already taken"});

  // check if email already exists
  db.query(`
    SELECT * 
    FROM users
    WHERE email = $1;
  `, [email], (err: any, result: any) => {

      if (err) console.log(err)
      if(result.rows.length > 0) return res.status(400).send({message: "email already taken"});

        // create new user
        // generate salt
        // hash(encrypt) our password using the salt
        // execute sql query 
        bcrypt.genSalt(10, (err, salt) => {

          bcrypt.hash(password, salt, null, async (err, hash) => {

          if (err) console.log(err);

          db.query(`
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3);
          `, [username, email, hash], (err: any, result: any) => {

            if (err) console.log(err)

            return res.status(200).send({message: 'ok'});

          });
        });
      });
    });
  });
});


export default router;




