const express=require('express')
const router=express.Router()
const post = require('../controllers/post');



router.get('/', post.getAllPosts(req, res));
router.post('/', post.createPost(req, res));
  

module.exports = router