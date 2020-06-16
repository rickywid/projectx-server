import express from 'express';
const router = express.Router();
import db from '../lib/db';

router.get('/', function(req, res, next) {
    db.query(`
      SELECT 
          projects.id,
          projects.name,
          projects.description,
          projects.tagline,
          projects.url,
          projects.images,
          projects.collaboration,
          (SELECT count(*) FROM comments WHERE comments.project_id = projects.id) AS comment_count,
          (SELECT id FROM users WHERE users.id = projects.user_id) AS user_id,
          (SELECT username FROM users WHERE users.id = projects.user_id),
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
      FROM projects;
    `, [], (err: any, result: { rows: any; }) => {
      if (err) {
        return console.log(err)
      }
      res.json({data: result.rows, user: req.user} );
    })
});

export default router;
