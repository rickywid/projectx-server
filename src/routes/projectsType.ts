import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:name', function (req, res, next) {

    const name = req.params.name;
    const page: any = req.query.page;
    const offset: any = req.query.offset;

    if(name === 'popular') {
        db.query(`
        SELECT 
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
        ORDER BY likes_count DESC
        LIMIT $2 OFFSET($1 - 1) * $2;
        `, [page, offset], (err: any, result: { rows: any; }) => {
            if (err) {
                return console.log(err)
              }
            
            const projects = result.rows;

            db.query(
                `SELECT COUNT(*) FROM projects;`
              , [], (err: any, result: { rows: any; }) => {
                if (err) {
                  return console.log(err)
                }
        
                const total: number = parseInt(result.rows[0].count);
                const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) ? false : true;
                
                res.json({
                  data: projects || [],
                  hasMore,
                  total
                });
            });
        });
    }

    if(name === 'frontend' || name === 'fullstack') {
        db.query(`
        SELECT 
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
        WHERE type = $1
        ORDER BY created_on ASC
        LIMIT $2 OFFSET($3 - 1) * $2;
        `, [name, offset, page], (err: any, result: { rows: any; }) => {
            if (err) {
                return console.log(err)
              }
            
            const projects = result.rows;

            db.query(
                `SELECT COUNT(*) FROM projects WHERE type = $1;`
              , [name], (err: any, result: { rows: any; }) => {
                if (err) {
                  return console.log(err)
                }
        
                const total: number = parseInt(result.rows[0].count);
                const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) ? false : true;
        
                res.json({
                  data: projects || [],
                  user: req.user,
                  hasMore,
                  total
                });
              });
        });
    }

    if(name === 'collaboration') {
        db.query(`
        SELECT 
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
        WHERE collaboration = true
        ORDER BY created_on ASC
        LIMIT $2 OFFSET($1 - 1) * $2;
        `, [page, offset], (err: any, result: { rows: any; }) => {
            if (err) {
                return console.log(err)
                }
        
                const total: number = parseInt(result.rows.length);
                const hasMore = Math.ceil(total / parseInt(offset)) === parseInt(page) ? false : true;
        
            res.json({
                data: result.rows || [],
                total,
                hasMore
            });
        })
    }
});

export default router;

