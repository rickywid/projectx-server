import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
import mailer from '../lib/mailer';
import { v4 as uuidv4 } from 'uuid';
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
        repourl: string;
        technologies: string;
        tags: string;
        collaboration: boolean;
        screenshots: string;
        user_id: string;
        uuid: string;
        type: string;
      }
      const { name, description, tagline, url, technologies, tags, collaboration, screenshots, user_id, repourl, type }: IFields = fields as any as IFields;
      
      const tagsArr = tags.split(',').map(num => parseInt(num));
      const technologiesArr = technologies.split(',').map(num => parseInt(num));
      const screenshotsArr = screenshots.split(',');
      
      db.query(`
      WITH
        t1 AS (INSERT INTO projects(NAME, description, tagline, url, collaboration, user_id, images, repo, uuid, TYPE) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $10, $11, $12) RETURNING uuid),
        t2 AS (INSERT INTO projects_technologies(project_id, technology_id) 
                SELECT t1.uuid, UNNEST($8::INTEGER[]) FROM t1), 
        t3 AS (INSERT INTO projects_tags(project_id, tag_id) 
                SELECT t1.uuid, UNNEST($9::INTEGER[]) FROM t1)

      SELECT uuid FROM t1;
          
          `,[name, description, tagline, url, collaboration, user_id, screenshotsArr, technologiesArr, tagsArr, repourl, uuidv4(), type], (err: any, result: any) => {
        if (err) {
          return console.log(err)
        }

        const uuid = result.rows[0].uuid;

        mailer(
          'New Project Added',
          `A new project has been added to CodeConcept. View the project at https://beta.codeconcept.io/project/${uuid}`
          ).catch(console.error);     
        
        res.json({
          status: 'ok',
          uuid
        });
      })
    });
});

export default router;