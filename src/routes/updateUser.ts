import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.put('/:id', function (req, res, next) {
    const userID = req.params.id;
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
  
      const { profilePic, githubUrl, twitterUrl, userProfileUrl } = fields;

      let description = fields.description === 'null' ? null : fields.description;
        
      if(err) {
        console.log(err);
        throw err; 
      }

      db.query(`
        UPDATE users 
        SET
            gh_profile_url = $1,
            twitter_profile_url = $2,
            user_profile_url = $3,
            description = COALESCE($4, description),
            gh_avatar = COALESCE($5, gh_avatar)
        WHERE id = $6;        
      `, [githubUrl, twitterUrl, userProfileUrl, description, profilePic, userID], (err: any, result: any) => {
            if (err) { console.log(err) };

            res.send({msg: 'ok'});
        });
    });
});

export default router;
