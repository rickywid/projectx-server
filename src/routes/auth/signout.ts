import express from 'express';
import db from '../../lib/db';
const router = express.Router();

router.post('/', function (req, res, next) {
    req.logOut();
    req.session?.destroy(function(err) {
      res.send({ status: 200 })
    });
});


export default router;