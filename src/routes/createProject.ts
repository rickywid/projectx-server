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

      interface IFields {
        name: string;
        description: string;
        tagline: string;
        url: string;
        technologies: string;
        tags: string;
        collaboration: boolean;
        screenshots: string;
        user_id: string;
      }
      const { name, description, tagline, url, technologies, tags, collaboration, screenshots, user_id }: IFields = fields as any as IFields;
      
      const tagsArr = tags.split(',').map(num => parseInt(num));
      const technologiesArr = technologies.split(',').map(num => parseInt(num));
      const screenshotsArr = screenshots.split(',');
      
      db.query(`
          WITH
            t1 AS (INSERT INTO projects(name, description, tagline, url, collaboration, user_id, images) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7) returning id),
            t2 AS (INSERT INTO projects_technologies(project_id, technology_id) 
                    SELECT t1.id, unnest($8::integer[]) from t1) 

          INSERT INTO projects_tags(project_id, tag_id) select t1.id, unnest($9::integer[]) 
          FROM t1;`,[name, description, tagline, url, collaboration, user_id, screenshotsArr, technologiesArr, tagsArr], (err: any, result: any) => {
        if (err) {
          return console.log(err)
        }
        
        res.json({status: 200});
      })
    });
});

export default router;