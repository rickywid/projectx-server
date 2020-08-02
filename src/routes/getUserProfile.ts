import express from 'express';
import db from './../lib/db';
const router = express.Router();

router.get('/:username', function (req, res, next) {
    const username = req.params.username;
    let loggedInUser: string;
    
    // check if req.user exists (if user is logged in)
    if(req.user) {
        const user = req.user as any;
        loggedInUser = user.username;
    } else {
        // if user is accessing user profile page directly after new user signup, get username from sessions
        loggedInUser = req!.session!.username;
    }

    // get user profile
    db.query(`
    SELECT 
        users.id,
        users.description,
        users.created_on,
        users.gh_avatar,
        users.user_profile_url,
        users.gh_profile_url,
        users.twitter_profile_url,
        users.username
    FROM users 
    WHERE username = $1`, [username], (err: any, result: any) => {
        if (err) console.log(err)

        if(!result.rows.length) {
            res.status(404).send('User not found');
            return;
        }
        
        const user = result.rows[0];
        user['selfProfile'] = username === loggedInUser;

        res.json({ user });
    });
});


export default router; 