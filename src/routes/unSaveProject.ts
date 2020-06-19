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
            DELETE FROM user_saved_projects
            WHERE project_id = $1
            AND user_id = $2;
        `, [id, fields.user_id], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };
            
            res.send({
                data: false
            });
        });
    });
});

export default router;