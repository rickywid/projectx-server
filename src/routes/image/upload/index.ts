// @ts-nocheck

import express from 'express';
import cloudinary from 'cloudinary';
import formidable from 'formidable';
const router = express.Router();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
  });
  
router.post('/', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => { 
      console.log(files)
      if(err) {
        console.log(err);
        throw err;
      }

    cloudinary.v2.uploader.upload(files.file.path, function(error, result) {
        if(error){
          console.log(error);
        }
        res.send(result)
      });
    });
});

export default router;
