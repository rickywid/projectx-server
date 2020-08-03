import express from 'express';
const router = express.Router();
import db from '../lib/db';

router.get('/', function(req, res, next) {
  const page: any = req.query.page;
  const offset: any = req.query.offset;

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
    ORDER BY created_on DESC
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
          user: req.user,
          hasMore
        });
      });
    })
});

export default router;
