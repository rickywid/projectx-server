import express from 'express';
const router = express.Router();

router.get('/', function (req, res, next) {
    
  const isAuthenticated = req.isAuthenticated();
  if(req.isAuthenticated()) {
    const { id, username, gh_avatar } = req.user as any;
    
    res.send({
      data: {id, username, gh_avatar, isAuthenticated },
      
    })
  } else {
    res.send({
      data: { isAuthenticated },
    })
  }
});


export default router;