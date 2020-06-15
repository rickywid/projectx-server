import express from 'express';
import passport from 'passport';
const router = express.Router();

router.post('/', passport.authenticate('local'), (req, res, next) => {
	
	console.log('login user:', req.user);
});


export default router;