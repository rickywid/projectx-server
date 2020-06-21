import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.put('/:id', function (req, res, next) {
    const userID = req.params.id;
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        

    let description = fields.description === 'null' ? null : fields.description;
        
      if(err) {
        console.log(err);
        throw err; 
      }

      db.query(`
        UPDATE users 
        SET
            description = COALESCE($1, description),
            gh_avatar = COALESCE($2, gh_avatar)
        WHERE id = $3;        
      `, [description, fields.profilePic, userID], (err: any, result: any) => {
            if (err) { console.log(err) };

            res.send({msg: 'ok'});
        });
    });
});

export default router;
