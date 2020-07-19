import express from 'express';
const router = express.Router();
import db from '../lib/db';

router.get('/', function(req, res, next) {
    db.query(`
      select 
        projects.uuid,
        projects.name,
        projects.description,
        projects.tagline,
        projects.url,
        projects.images,
        projects.collaboration,
        (select count(*) from comments where comments.project_id = projects.uuid) as comment_count,
        (select count(*) from likes where likes.project_id = projects.uuid) as likes_count,
        (select id from users where users.id = projects.user_id) as user_id,
        (select username from users where users.id = projects.user_id),
        (select gh_avatar from users where users.id = projects.user_id),

        (select array_agg(technologies.name::TEXT)
          from projects_technologies
          inner join technologies
          on technologies.id = projects_technologies.technology_id
          where projects_technologies.project_id = projects.uuid) as technologies,
        
          (select array_agg(tags.name::TEXT)
            from projects_tags
            inner join tags
            on tags.id = projects_tags.tag_id
            where projects_tags.project_id = projects.uuid) as tags
      from projects
      order by created_on asc;
    `, [], (err: any, result: { rows: any; }) => {
      if (err) {
        return console.log(err)
      }
      res.json({
        data: result.rows || [], 
        user: req.user
      });
    })
});

export default router;
