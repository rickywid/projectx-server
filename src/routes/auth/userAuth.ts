import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {

    /**
     * Check if a user is authenticated
     */

    if(req.isAuthenticated() || req.session!.authenticated) {
        const u:any = req.user;
        
        res.send({
            id: req.session!.userID || u.id,
            username: req.session!.username || u.username,
            isAuthenticated: true
        });
    } else {
        res.status(401).send({message: 'Unauthorized'});
    }
});

export default router;