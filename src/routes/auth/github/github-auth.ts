import express from 'express';
const router = express.Router();
import passport from 'passport';
import '../../../lib/passport';

router.get('/', passport.authenticate('github'), function (req, res, next) {
	console.log('blah')
});


export default router;