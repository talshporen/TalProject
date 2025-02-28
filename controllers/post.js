 const getAllPosts = (req, res) => {
    console.log('posts get all service');
    res.send('posts get all service');
 };

 const createPost = (req, res) => {
    console.log('posts create service');
    res.send('posts create service');
 };

 module.exports = {
    getAllPosts,
    createPost
 }; 
