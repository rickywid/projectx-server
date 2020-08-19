import express from 'express';
import passport from 'passport';
const router = express.Router();

router.post('/', (req: any, res, next) => {

	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err); }

		if (!user) {
			return res.status(401).json({
				authenticated: false,
				message: info.message
			});
		}

		req.logIn(user, function (err: any) {
			if (err) { return next(err); }

			const userID = user.id;

			res.json({
				authenticated: true,
				user_id: userID
			});
		});
	})(req, res, next);




});


export default router;