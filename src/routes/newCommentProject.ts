import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.post('/', function (req, res, next) {
    
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
      if(err) {
        console.log(err);
        throw err; 
      }
      fields.user_id, fields.project_id, fields.comment
      const { user_id, project_id, comment } = fields;

      db.query(`
      INSERT INTO comments (user_id, project_id, comment)
      VALUES ($1, $2, $3) returning id as comment_id, user_id;`
      ,[user_id, project_id, comment], (err: any, result: any) => {
        if (err) {
          return console.log(err)
        }
        
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
        
      `, [fields.project_id], (err: any, result: any) => {
            if (err) { console.log(err) };
            
            res.json({data: result.rows});
        }); 
      });
    });
});

export default router;