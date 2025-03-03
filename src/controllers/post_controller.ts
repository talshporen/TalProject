import postModel from '../models/posts_model'
 import { Request, Response } from 'express';

 const getAllPosts = async (req:Request, res:Response) => {
   const ownerFilter = req.query.owner;
   try{
      if(ownerFilter) {
         const posts = await postModel.find({owner: ownerFilter});
         res.status(200).send(posts);
      } else {
      const posts = await postModel.find();
      res.status(200).send(posts);
      }
   } catch(error) {
      res.status(400).send(error);
   }  
 };

 const getPostById = async (req:Request, res:Response) => {
   const postId = req.params.id;
   try{
      const post = await postModel.findById(postId);
      if (post == null)
      {
         return res.status(404).send('Post not found');
      }else{
         return res.status(200).send(post);
      }

   } catch(error) {
      res.status(400).send(error);
   }
};

 const createPost =async (req:Request, res:Response) => {
   const post = req.body;
   try{
      const newPost = await postModel.create(post);
      res.status(201).send(newPost);
   }catch(error){
      res.status(400).send(error);
   }
};

 const deletePostById = async (req:Request, res:Response) => {
   const postId = req.params.id;
   try{
      await postModel.findByIdAndDelete(postId);
      res.status(200).send();
   } catch(error) {  
      res.status(400).send(error);
   }
};


export default {
    getAllPosts,
    createPost,
    getPostById,
    deletePostById
 }; 

