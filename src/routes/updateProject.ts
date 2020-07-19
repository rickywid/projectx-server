import express from 'express';
import formidable from 'formidable';
import db from '../lib/db';
const router = express.Router();

router.put('/:id', function (req, res, next) {
    const user = req.user as any;
    const userID = req!.session!.userID || user.id;
    const projectID = req.params.id;
    
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
        type: string;
      }
      const { name, description, tagline, url, technologies, tags, collaboration, screenshots, repourl, type }: IFields = fields as any as IFields;
      
      const tagsArr = tags.split(',').map(num => parseInt(num));
      const technologiesArr = technologies.split(',').map(num => parseInt(num));
      const screenshotsArr = screenshots.split(',');

      // update projects table
      db.query(`
        UPDATE projects
        SET 
            name = $1,
            description = $2,
            tagline = $3,
            url = $4,
            collaboration = $5,
            user_id = $6,
            images = $7,
            repo = $8,
            type = $9
        WHERE uuid = $10;
        
      `, [name, description, tagline, url, collaboration, userID, screenshotsArr, repourl, type, projectID], (err: any, result: any) => {
            if (err) { console.log(err) };

            // update projects_technologies table
            db.query(`
            WITH
                t1 AS (DELETE FROM projects_technologies WHERE project_id = $1)
           
            INSERT INTO 
                projects_technologies(project_id, technology_id) 
            SELECT $1, unnest($2::integer[]);
            `, [projectID, technologiesArr], (err: any, result: any) => {
                if (err) { console.log(err) };

                // update projects_tags table
                db.query(`
                WITH
                    t1 AS (DELETE FROM projects_tags WHERE project_id = $1)
           
                INSERT INTO 
                    projects_tags(project_id, tag_id) 
                SELECT $1, unnest($2::integer[]);
                `, [projectID, tagsArr], (err: any, result: any) => {
                    res.json({status: 200});
                });
            });
        });
    });
});

export default router;


// "projects_technologies_pkey" PRIMARY KEY, btree (project_id, technology_id)