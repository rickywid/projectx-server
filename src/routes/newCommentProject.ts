import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.post('/', function (req, res, next) {
    
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        console.log(fields)
      if(err) {
        console.log(err);
        throw err; 
      }
      fields.user_id, fields.project_id, fields.comment
      const { user_id, project_id, comment } = fields;

      db.query(`
      INSERT INTO comments (user_id, project_id, comment)
      VALUES ($1, $2, $3);`
      ,[user_id, project_id, comment], (err: any, result: any) => {
        if (err) {
          return console.log(err)
        }

        const { id, username, gh_avatar } = req.user as any;
      
        res.send({
          data: {id, username, gh_avatar }
        });
      });
    });
});

export default router;