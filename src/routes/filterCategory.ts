import express from 'express';
import db from '../lib/db';
const router = express.Router();

router.get('/:category', function (req, res, next) {
    const id = req.params.category;
    const page: any = req.query.page;
    const offset: any = req.query.offset;
    
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

    FROM projects_tags
    INNER JOIN projects
    ON projects.uuid = projects_tags.project_id
    WHERE projects_tags.tag_id = $1
    LIMIT $2 OFFSET($3 - 1) * $2;

    `, [id, offset, page], (err: any, results: any) => {
        if (err) {
            return console.log(err)
          }
    
          const projects = results.rows;
    
          db.query(
            `
                SELECT COUNT(*) FROM projects
                INNER JOIN projects_tags
                ON projects.uuid = projects_tags.project_id
                WHERE projects_tags.tag_id = $1;
            `
          , [id], (err: any, result: { rows: any; }) => {
                if (err) {
                return console.log(err)
                }
        
                const total: number = parseInt(result.rows[0].count);
                const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) || total <= offset ? false : true;
        
                res.json({
                data: projects || [], 
                total,
                hasMore
            });
        });
    })
});


export default router;

