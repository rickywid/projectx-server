import express from 'express';
import passport from 'passport';
const router = express.Router();

router.post('/', passport.authenticate('local'), (req: any, res, next) => {
	const userID = req.user.id;
	res.send({ id: userID });
});


export default router;