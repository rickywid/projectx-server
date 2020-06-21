import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/', function (req, res, next) {

    const project = req.query.project;
    
    db.query(`
        SELECT 

            COUNT(*) OVER () as total_rows,

            projects.id,
            projects.name,
            projects.description,
            projects.tagline,
            projects.url,
            projects.images,
            projects.collaboration,
            (select count(*) from comments where comments.project_id = projects.id) as comment_count,
            (select count(*) from likes where likes.project_id = projects.id) as likes_count,
        (select id from users where users.id = projects.user_id) as user_id,
            (select username from users where users.id = projects.user_id),
            (select gh_avatar from users where users.id = projects.user_id),

            (select array_agg(technologies.name::TEXT)
            from projects_technologies
            inner join technologies
            on technologies.id = projects_technologies.technology_id
            where projects_technologies.project_id = projects.id) as technologies,

            (select array_agg(tags.name::TEXT)
            from projects_tags
            inner join tags
            on tags.id = projects_tags.tag_id
            where projects_tags.project_id = projects.id) as tags

        FROM projects 
        WHERE ($1::varchar(255) IS NULL OR name ILIKE $1);
    `, ['%'+project+'%'], (err: any, results: any) => {

        res.send({
            data: results.rows.length ? results.rows : [],
            count: results.rows.length ? results.rows[0].total_rows : 0
        });
    })
});


export default router;

