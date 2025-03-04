import express ,{ Request, Response } from 'express';
import postsControler from'../controllers/post_controller';

const router = express.Router();


router.get('/',(req:Request,res: Response)=>{
    postsControler.getAll(req,res);
});
router.get("/:id",(req:Request,res: Response)=>{
    postsControler.getById(req,res);
});
router.post("/",(req:Request,res: Response)=>{
    postsControler.createItem(req,res);
});

router.delete("/:id",(req:Request,res: Response)=>{
    postsControler.deleteItem(req,res);
});

export default router;
