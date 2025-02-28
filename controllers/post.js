 const postModel = require('../models/posts_model');

 const getAllPosts =async (req, res) => {
   const ownerFilter = req.query.owner;
   try{
      const posts = await postModel.find();
      res.status(200).send(posts);
}catch(error){
   res.status(400).send(error.mesege);
}
 };

 const getPostById = (req, res) => {
   const postId = req.params.id;
   res.send('get a post by id: ' + postId);
};

 const createPost =async (req, res) => {
   const post = req.body;
   try{
      const newPost = await postModel.create(post);
      res.status(201).send(newPost);
   }catch(error){
      res.status(400).send(error);
   }
};
   



 const deletePostById = (req, res) => {
   const postId = req.params.id;
   res.send('delete a post by id' + postId);
};


 module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    deletePostById
 }; 

