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
        INSERT INTO ReportProject (project_id, comment)
        VALUES ($1, $2);
    `, [project_id, comment], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };

            res.send({
                message: 'success'
            });
        });
    });
});

export default router;