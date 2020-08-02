import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:project_id/comments', function (req, res, next) {

    const projectID = req.params.project_id;
    const commentsType = req.query.comments_sort;
    const page: any = req.query.page;
    const offset: any = req.query.offset;

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
        ORDER BY comments.created_on ASC
        LIMIT $2 OFFSET($3 - 1) * $2;;
        `, [projectID, offset, page], (err: any, result: { rows: any; }) => {
            if (err) {
                return console.log(err)
              }
        
              const comments = result.rows;
        
              db.query(
                `
                    SELECT COUNT(*) FROM comments
                    WHERE project_id = $1
                `
              , [projectID], (err: any, result: { rows: any; }) => {
                    if (err) {
                    return console.log(err)
                    }
            
                    const total: number = parseInt(result.rows[0].count);
                    const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) || total <= offset ? false : true;
            
                res.json({
                    data: comments || [], 
                    total,
                    hasMore
                });
            });
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
        ORDER BY comments.created_on DESC
        LIMIT $2 OFFSET($2 - 3) * $2;;
        `, [projectID, offset, page], (err: any, result: { rows: any; }) => {
            if (err) { console.log(err) };
            
            const total = result.rows.length;
            const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) ? false : true;
            
            res.send({
                data: result.rows,
                hasMore
            })
        }); 
    }
});

export default router;

