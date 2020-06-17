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
        INSERT INTO likes (user_id, project_id)
        VALUES ($1, $2);
    `, [fields.user_id, id], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };

            db.query(`
        SELECT
            (SELECT array_agg(user_id) AS users 
            FROM likes 
            WHERE project_id = $1),
            COUNT(*)
        FROM likes
        WHERE project_id = $1;
        `, [id], (err: any, result: { rows: any; }) => {
                if (err) { console.log(err) };
                const data = result.rows[0];

                // prevent returning NULL value - return an empty array if no users has liked the project
                data.users = data.users || []
                res.json({
                    data: result.rows[0]
                });
            });
        })
    })
});

export default router;