import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:id', function (req, res, next) {

    const id = req.params.id;
    const userID = req.query.userID;
    
    let project: any;
    let comments: any;
    let likes: any;

    // get project info
    db.query(`
        SELECT 
            projects.uuid,
            projects.name,
            projects.tagline,
            projects.description,
            projects.url,
            projects.repo,
            projects.type,
            projects.collaboration,
            projects.images,
            projects.user_id,
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
                WHERE projects_technologies.project_id = projects.uuid) AS technologies,


        (SELECT array_agg(tags.name::TEXT)
            FROM projects_tags
            INNER JOIN tags
            ON tags.id = projects_tags.tag_id
            WHERE projects_tags.project_id = projects.uuid) AS tags

        FROM projects
        WHERE projects.uuid::text = $1;
    `, [id], (err: any, result: { rows: any; }) => {
        if (err) { console.log(err) }
        
        if(result.rows.length === 0) {
            res.status(404).send('Project not found');
            return;
        }
        
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
        WHERE project_id = $1
        ORDER BY comments.created_on ASC;
        ;
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


                /**
                 * Return 401(unauthorized) if user who is trying edit the project 
                 * is not the project owner
                 */
                
                if(userID && userID !== 'undefined') {
                    if(project.user_id.toString() !== userID) {
                        res.status(401).json({message: 'Unauthorized'});
                        return;
                    }
                }

                likes = result.rows[0];
                likes['users'] = likes['users'] || [];
                
                res.json({ project, comments, likes });
            });
        });
    })
});

export default router;

