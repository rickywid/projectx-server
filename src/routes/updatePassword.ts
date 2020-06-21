import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
import bcrypt from 'bcrypt-nodejs';

const router = express.Router();

router.put('/', function (req, res, next) {

    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {

        if (err) {
            console.log(err);
            throw err;
        }


        db.query(`
      SELECT * FROM users
      WHERE id = $1;
    `, [fields.userID], (err: any, result: any) => {
            if (err) {
                return console.log(err)
            }

            const user = result.rows[0];

            bcrypt.compare(fields.currentPassword as string, user.password, (err: any, isMatch: any) => {
                if (err || !isMatch) {
                    return res.status(401).send({ message: 'Incorrect password' });
                }

                bcrypt.genSalt(10, (err, salt) => {

                    bcrypt.hash(fields.newPassword as string, salt, null, async (err, hash) => {

                        if (err) console.log(err);

                        db.query(`
                UPDATE users 
                SET
                    password = COALESCE($1, password)
                WHERE id = $2;        
              `, [hash, fields.userID], (err: any, result: any) => {
                            if (err) { console.log(err) };

                            return res.send({ msg: 'success' });
                        });
                    });
                });
            })
        })
    });
});

export default router;
