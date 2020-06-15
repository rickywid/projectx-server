import express from 'express';
import passport from 'passport';
import '../lib/passport';

const router = express.Router();

router.get('/', function (req, res, next) {
  console.log('get user')
    console.log(req.session)
    console.log(req.user)
    console.log(req.isAuthenticated())
});


export default router;