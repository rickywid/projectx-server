import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:id', function (req, res, next) {

    const id = parseInt(req.params.id);
    let project: any;
    let comments: any;
    let likes: any;

    // get project info
    db.query(`
        SELECT 
            projects.id,
            projects.name,
            projects.tagline,
            projects.description,
            projects.url,
            projects.repo,
            projects.collaboration,
            projects.images,
            projects.created_on,
            (SELECT username 
            FROM users 
            WHERE users.id = projects.user_id),
            (SELECT gh_avatar 
                FROM users 
                WHERE users.id = projects.user_id),
            (SELECT array_agg(technologies.name::TEXT)
        FROM projects_technologies
        INNER JOIN technologies
        ON technologies.id = projects_technologies.technology_id
        WHERE projects_technologies.project_id = projects.id) AS technologies,


        (SELECT array_agg(tags.name::TEXT)
        FROM projects_tags
        INNER JOIN tags
        ON tags.id = projects_tags.tag_id
        WHERE projects_tags.project_id = projects.id) AS tags

        FROM projects
        WHERE projects.id = $1;
    `, [id], (err: any, result: { rows: any; }) => {
        if (err) { console.log(err) };
        
        project = result.rows[0];
        
        // get project's comments
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
        WHERE project_id = $1;
        `, [id], (err: any, result: { rows: any; }) => {
            if(err) { console.log(err )};
            comments = result.rows;

            // get project's likes
            db.query(`
            SELECT
                (SELECT array_agg(user_id) AS users 
                FROM likes 
                WHERE project_id = $1),
            COUNT(*)
            FROM likes
            WHERE project_id = $1;
            `, [id], (err: any, result: { rows: any; }) => {
                if(err) { console.log(err )};
                likes = result.rows[0];
                likes['users'] = likes['users'] || [];
                
                res.json({ project, comments, likes });
            });
        });
    })
});

export default router;

