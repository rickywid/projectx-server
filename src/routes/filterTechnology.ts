import express from 'express';
import db from '../lib/db';
const router = express.Router();

router.get('/:technology', function (req, res, next) {
    const id = req.params.technology;
    
    db.query(`
    SELECT 

        projects.uuid,
        projects.name,
        projects.tagline,
        projects.description,
        projects.url,
        projects.collaboration,
        projects.images,
        projects.created_on,

        (select count(*) from comments where comments.project_id = projects.uuid) as comment_count,
        (select count(*) from likes where likes.project_id = projects.uuid) as likes_count,

        (select id from users where users.id = projects.user_id) as user_id,
        (select username from users where users.id = projects.user_id),
        (select gh_avatar from users where users.id = projects.user_id),

        (SELECT array_agg(tags.name::TEXT)
        FROM projects_tags
        INNER JOIN tags
        ON tags.id = projects_tags.tag_id
        WHERE projects_tags.project_id = projects.uuid) as tags

    FROM projects_technologies
    INNER JOIN projects
    ON projects.uuid = projects_technologies.project_id
    WHERE projects_technologies.technology_id = $1;

    `, [id], (err: any, results: any) => {

        res.send({
            data: results.rows
        });
    })
});


export default router;

