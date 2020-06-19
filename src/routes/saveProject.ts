import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.post('/:id', function (req, res, next) {

    const id = parseInt(req.params.id);
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) throw err;
        // add new like and get latest like count and list of user id's

        db.query(`
        INSERT INTO user_saved_projects (user_id, project_id)
        VALUES ($1, $2);
    `, [fields.user_id, id], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };

            res.json({
                data: true
            });
        })
    })
});

export default router;