const request = require('supertest');
const appInit = require('../server');
const mongoose = require('mongoose');
const postmodel = require('../models/posts_model');
const testPost = require('./test_Posts');

let app;
beforeAll (async() => {
  console.log('before all tests');
  app = await appInit();
  await postmodel.deleteMany();  
});

afterAll (() => {
  console.log('after all tests');
  mongoose.connection.close();
});

describe("posts Test", () => {
    test("Test get all post enpty",async()=>{
        const response = await request(app).get('/posts');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("Test create new post",async()=>{
      for(let post of testPost){
        const response = await request(app).post('/posts').send(post);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(post.owner);
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
        post._id = response.body._id;
      }        
      });

      test("Test get all post enpty",async()=>{
        const response = await request(app).get('/posts');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(testPost.length);
    });
    test("Test get post by id",async()=>{
      const response = await request(app).get('/posts/'+testPost[0]._id);
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBe(testPost[0]._id);
      
    });

    test("Test filter post by owner",async()=>{
      const response = await request(app).get(
        '/posts?owner='+ testPost[0].owner
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
    });

    test("Test delete post",async()=>{
      const response = await request(app).delete('/posts/'+testPost[0]._id);
      expect(response.statusCode).toBe(200);

      const responseGet = await request(app).get('/posts/'+testPost[0]._id);
      expect(responseGet.statusCode).toBe(404);
    });


    test("Test create new post fail",async()=>{
        const response = await request(app).post('/posts').send({
          title: "test post 1",
          content: "test content 1",
        });
        expect(response.statusCode).toBe(400);

      });       

});
