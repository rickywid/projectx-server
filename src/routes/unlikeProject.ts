import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.delete('/:id', function (req, res, next) {

    const id = parseInt(req.params.id);
    
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
        if(err) throw err;

        let data: any;
        db.query(`
            DELETE FROM likes
            WHERE project_id = $1
            AND user_id = $2;
        `, [id, fields.user_id], (err: any, result: { rows: any; }) => {
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
                
                data = result.rows[0];
                
                // prevent returning NULL value - return an empty array if no users has liked the project
                data.users = data.users || []
                res.send({
                    data: data
                });
            });
        });
    });
});

export default router;