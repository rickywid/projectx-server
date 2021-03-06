import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.put('/:id', function (req, res, next) {
    const commentID = req.params.id;
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        db.query(`
        UPDATE comments
        SET comment = $1
        WHERE id = $2;
        
      `, [fields.comment, commentID], (err: any, result: any) => {
            if (err) { console.log(err) };

            db.query(`
            SELECT 
                comments.id AS comment_id,
                comment,
                project_id, 
                comments.created_on,
                username,
                gh_avatar,
                users.id AS user_id
            FROM comments
            JOIN users
            ON users.id = comments.user_id
            WHERE project_id = $1
            ORDER BY comments.created_on ASC;
            
          `, [fields.project_id], (err: any, result: any) => {
                if (err) { console.log(err) };

                res.json({ data: result.rows });
            });
        });
    });
});

export default router;
