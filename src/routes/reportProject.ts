import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.post('/', function (req, res, next) {

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {

        const { project_id, comment } = fields;

        if (err) throw err;
        
        db.query(`
        UPDATE projects
        SET reported = true
        WHERE uuid = $1;
    `, [project_id], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };

            res.send({
                message: 'success'
            });
        });
    });
});

export default router;