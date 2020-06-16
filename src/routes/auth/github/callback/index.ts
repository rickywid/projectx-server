import express from 'express';
import passport from 'passport';
import '../../../../lib/passport';

const router = express.Router();

router.get('/', passport.authenticate('github'), function (req, res, next) {
      res.redirect(`http://localhost:3000`)
});


export default router;