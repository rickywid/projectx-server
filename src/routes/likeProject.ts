import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.post('/:id', function (req, res, next) {

   /**
    * Protected Endpoint - User must be authenticated
    */

    if(req?.isAuthenticated()) {
        const id = req.params.id;
        const form = new formidable.IncomingForm();
    
        form.parse(req, async (err, fields, files) => {
            if (err) throw err;
    
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
    
                    data.users = data.users || []
                    res.json({
                        data: result.rows[0]
                    });
                });
            })
        })
    } else {
        res.status(401).send('Unauthorized');
    }
});

export default router; 