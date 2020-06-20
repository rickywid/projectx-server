import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.delete('/:id', function (req, res, next) {

    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
        if(err) throw err;

        let data: any;
        db.query(`
            DELETE FROM projects
            WHERE id = $1;
        `, [fields.project_id], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };
            
            res.send({msg: 'success'});
        });
    });
});

export default router;