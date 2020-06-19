import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:id', function (req, res, next) {

    if(req.user) {
        const id = parseInt(req.params.id);
        const u = req.user as any;
        let project: any;
        let comments: any;
        let likes: any;
    
        // get project info
        db.query(`
            SELECT * 
            FROM user_saved_projects
            WHERE user_id = $1
            AND project_id = $2;
        `, [u.id, id], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };
            
            res.send({
                data: result.rows.length > 0 ? true : false
            })
        })
    } else {
        res.send({
            data: false
        })
    }

});

export default router;

