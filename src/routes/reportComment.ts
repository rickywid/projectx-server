import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.post('/', function (req, res, next) {

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {

        const { comment_id, } = fields;

        if (err) throw err;
        
        db.query(`
        UPDATE comments
        SET reported = true
        WHERE id = $1;
    `, [comment_id], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };

            res.send({
                message: 'success'
            });
        });
    });
});

export default router;