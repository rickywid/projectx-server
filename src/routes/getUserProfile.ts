import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:username', function (req, res, next) {
    const username = req.params.username;
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
        users.id,
        users.description,
        users.created_on,
        users.gh_avatar,
        users.user_profile_url,
        users.gh_profile_url,
        users.twitter_profile_url,
        users.username
    FROM users 
    WHERE username = $1`, [username], (err: any, result: any) => {
        if (err) console.log(err)
        
        const user = result.rows[0];
        user['selfProfile'] = username === loggedInUser;

        // get user's saved projects
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
        
        FROM user_saved_projects
        INNER JOIN projects
        ON projects.uuid = user_saved_projects.project_id
        WHERE user_saved_projects.user_id = $1; 
        
        `, [user.id], (err: any, result: any) => {
            if (err) console.log(err);

            const savedProjects = result.rows;

            // get user's liked projects
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

            FROM likes
            INNER JOIN projects
            ON likes.project_id = projects.uuid
            WHERE likes.user_id = $1;
        
        `, [user.id], (err: any, result: any) => {
                if (err) console.log(err);

                const likedProjects = result.rows;

                // get user's projects
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
                WHERE user_id = $1;
        `, [user.id], (err: any, result: any) => {
                    if (err) console.log(err);

                    const userProjects = result.rows;

                    res.send({
                        data: {user, likedProjects, savedProjects, userProjects},
                    })
                })
            })
        })
    });
});


export default router;