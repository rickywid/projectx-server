import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {

    /**
     * Check if a user is authenticated
     */

    if(req.isAuthenticated()) {
        const u:any = req.user;
        
        res.send({
            id: u.id,
            username: u.username,
            isAuthenticated: true
        });
    } else {
        res.status(401).send({message: 'Unauthorized'});
    }
});

export default router;