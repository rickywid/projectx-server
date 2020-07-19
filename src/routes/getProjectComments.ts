import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:project_id/comments', function (req, res, next) {

    const projectID = req.params.project_id;
    const commentsType = req.query.comments_sort;

    if(commentsType ==='oldest') {
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
        `, [projectID], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };
            
            res.send({data: result.rows})
        }); 
    }

    if(commentsType ==='newest') {
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
        ORDER BY comments.created_on DESC;
        `, [projectID], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };
            
            res.send({data: result.rows})
        }); 
    }
});

export default router;

