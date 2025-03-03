import express from 'express';
const router = express.Router();
import post from'../controllers/post_controller';


router.get('/',post.getAllPosts);
router.get("/:id",(req,res)=>{
    post.getPostById(req,res);
});
router.post('/',post.createPost);
router.delete('/:id',post.deletePostById);
  
export default router;
