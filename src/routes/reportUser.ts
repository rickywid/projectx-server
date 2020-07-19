import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.post('/', function (req, res, next) {

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {

        const { user_id, reason } = fields;
        const value = reason.length > 1 ? reason : null;

        if (err) throw err;
        
        db.query(`
        INSERT INTO reportuser (user_id, reason)
        VALUES($1, $2);
    `, [user_id, value], (err: any, result: { rows: any; }) => {
            if (err) { 
                console.log(err);
                res.status(400).send({message: "Cannot be blank"});
                return;
            };

            res.send({
                message: 'success'
            });
        });
    });
});

export default router;