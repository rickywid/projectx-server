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
    db.query(`SELECT * FROM users WHERE username = $1`, [username], (err: any, result: any) => {
        if (err) console.log(err)

        const user = result.rows[0];
        user['selfProfile'] = username === loggedInUser;

        // get user's saved projects
        db.query(`
            select 
                projects.id, 
                projects.name, 
                projects.images,
                (select count(*) from comments where comments.project_id = projects.id) as comment_count,
                (select count(*) from likes where likes.project_id = projects.id) as likes_count,
                (select id from users where users.id = projects.user_id) as owner_id,
                (select username from users where users.id = projects.user_id),
                (select gh_avatar from users where users.id = projects.user_id),

                (select array_agg(tags.name::TEXT)
                from projects_tags
                inner join tags
                on tags.id = projects_tags.tag_id
                where projects_tags.project_id = projects.id) as tags

            from user_saved_projects
            inner join projects
            on projects.id = user_saved_projects.project_id
            where user_saved_projects.user_id = $1; 
        
        `, [user.id], (err: any, result: any) => {
            if (err) console.log(err);

            const savedProjects = result.rows;

            // get user's liked projects
            db.query(`
            select 
                projects.id, 
                projects.name, 
                projects.images,
                (select count(*) from comments where comments.project_id = projects.id) as comment_count,
                (select count(*) from likes where likes.project_id = projects.id) as likes_count,
                (select id from users where users.id = projects.user_id) as owner_id,
                (select username from users where users.id = projects.user_id),
                (select gh_avatar from users where users.id = projects.user_id),

                (select array_agg(tags.name::TEXT)
                from projects_tags
                inner join tags
                on tags.id = projects_tags.tag_id
                where projects_tags.project_id = projects.id) as tags

            from likes
            inner join projects
            on likes.project_id = projects.id
            where likes.user_id = $1;
        
        `, [user.id], (err: any, result: any) => {
                if (err) console.log(err);

                const likedProjects = result.rows;

                // get user's projects
                db.query(`
            select 
                projects.id, 
                projects.name,
                projects.images,
                (select count(*) from comments where comments.project_id = projects.id) as comment_count,
                (select count(*) from likes where likes.project_id = projects.id) as likes_count,
                (select id from users where users.id = projects.user_id) as owner_id,
                (select username from users where users.id = projects.user_id),
                (select gh_avatar from users where users.id = projects.user_id),

                (select array_agg(tags.name::TEXT)
                from projects_tags
                inner join tags
                on tags.id = projects_tags.tag_id
                where projects_tags.project_id = projects.id) as tags

            from projects
            where user_id = $1;
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