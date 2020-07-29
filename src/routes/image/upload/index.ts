// @ts-nocheck

import express from 'express';
import cloudinary from 'cloudinary';
import formidable from 'formidable';
import Jimp from 'jimp';

const router = express.Router();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
  });
  
router.post('/', (req, res, next) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => { 
      const fileType = fields.fileType;
      
      if(err) {
        console.log(err);
        throw err; 
      }

      if(fileType === "user") {
        Jimp.read(files.file.path, (err, profilePic) => {
          if (err) throw err;
          profilePic
            .resize(256, 256) 
            .quality(60) 
            .write(files.file.path);

            cloudinary.v2.uploader.upload(files.file.path, function(error, result) {
              if(error){
                console.log(error);
              }
            res.send(result);
          });
        });      
      };

      cloudinary.v2.uploader.upload(files.file.path, function(error, result) {
        if(error){
          console.log(error);
        }
      res.send(result);
    });
  });
});

export default router;
