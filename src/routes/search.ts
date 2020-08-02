import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/', function (req, res, next) {

    const project = req.query.project;
    const page: any = req.query.page;
    const offset: any = req.query.offset;

    db.query(`
    SELECT 
        COUNT(*) OVER () AS total_rows,
        projects.uuid,
        projects.name,
        projects.description,
        projects.tagline,
        projects.url,
        projects.images,
        projects.collaboration,
        (SELECT count(*) FROM comments WHERE comments.project_id = projects.uuid) AS comment_count,
        (SELECT count(*) FROM likes WHERE likes.project_id = projects.uuid) AS likes_count,
        (SELECT id FROM users WHERE users.id = projects.user_id) AS user_id,
        (SELECT username FROM users WHERE users.id = projects.user_id),
        (SELECT gh_avatar FROM users WHERE users.id = projects.user_id),

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
    WHERE ($1::varchar(255) IS NULL OR name ILIKE $1)
    LIMIT $3 OFFSET($2 - 1) * $3;
    `, ['%'+project+'%', page, offset], (err: any, results: any) => {
        if (err) {
            return console.log(err)
        }

        const projects = results.rows;

        db.query(
            `
            SELECT COUNT(*) FROM PROJECTS
            WHERE ($1::varchar(255) IS NULL OR name ILIKE $1)
            `
        , ['%'+project+'%'], (err: any, results: any) => {
            if (err) {
                return console.log(err)
            }

            const total: number = parseInt(results.rows[0].count);
            const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) ? false : true;
    
            res.send({
                data: projects.length ? projects : [],
                count: total,
                hasMore
            });   
        });
    })
});


export default router;

