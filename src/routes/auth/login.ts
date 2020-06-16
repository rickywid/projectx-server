import express from 'express';
import passport from 'passport';
const router = express.Router();

router.post('/', passport.authenticate('local'), (req, res, next) => {
	
	res.send({ status: 200 });
});


export default router;