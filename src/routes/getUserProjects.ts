import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:username/projects', function (req, res, next) {
    const username = req.params.username;
    const page: any = req.query.page;
    const offset: any = req.query.offset;
    let loggedInUser: string;
    
    // check if req.user exists (if user is logged in)
    if(req.user) {
        const user = req.user as any;
        loggedInUser = user.username;
    } else {
        // if user is accessing user profile page directly after new user signup, get username from sessions
        loggedInUser = req!.session!.username;
    }

    // get user profile
    db.query(`
    SELECT 
        users.id
    FROM users 
    WHERE username = $1`, [username], (err: any, result: any) => {
        if (err) console.log(err)

        if(!result.rows.length) {
            res.status(404).send('User not found');
            return;
        }
        
        const user = result.rows[0];
        user['selfProfile'] = username === loggedInUser;

            db.query(`
            SELECT 
                projects.uuid, 
                projects.name,
                projects.images,
                (SELECT count(*) FROM comments WHERE comments.project_id = projects.uuid) AS comment_count,
                (SELECT count(*) FROM likes WHERE likes.project_id = projects.uuid) AS likes_count,
                (SELECT id FROM users WHERE users.id = projects.user_id) AS owner_id,
                (SELECT username FROM users WHERE users.id = projects.user_id),
                (SELECT gh_avatar FROM users WHERE users.id = projects.user_id),

                (SELECT array_agg(tags.name::TEXT)
                FROM projects_tags
                INNER JOIN tags
                ON tags.id = projects_tags.tag_id
                WHERE projects_tags.project_id = projects.uuid) AS tags

            FROM projects
            WHERE user_id = $1
            LIMIT $2 OFFSET($3 - 1) * $2;
        
        `, [user.id, offset, page], (err: any, result: any) => {
            if (err) console.log(err);

            const projects = result.rows;

            db.query(
            `            
            SELECT COUNT(*)
            FROM projects
            WHERE user_id = $1;        
            `, [user.id], (err: any, result: any) => {
                if (err) console.log(err);

                const total: number = parseInt(result.rows[0].count);
                const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) || total <= offset ? false : true;

                res.json({
                    data: projects,
                    hasMore,
                    total
                });
            });
        });
    });
});


export default router; 