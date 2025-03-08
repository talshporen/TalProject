import request  from "supertest";
import initApp from '../server';
import mongoose from 'mongoose';
import postModel from "../models/posts_model";
import  { Express } from "express";
import userModel from "../models/user_model";


let app:Express;

type UserInfo = {
  email: string;
  password: string;
  token?: string;
  _id?: string;
  };
const userInfo:UserInfo = {
email: "tal.shporen1@gmail.com",
password:"123456"    
}


beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo.token = response.body.token;
  userInfo._id = response.body._id;
});

afterAll(async() => {
  await mongoose.connection.close();
});


let postId = "";
const testPost1 = {
  title: "my first post",
  content: "this is my first post",
  owner: "TalOwner",
};

const testPost2 = {
  title: "my first post 2",
  content: "This is my first post 2",
  owner: "TalOwner2",
};

const testPostFail = { 
    content: "this is my first post 2",
  owner: "TalOwner2",
};
  

describe("Posts Tests", () => {
  test("Posts get all test", async () => {
    const response = await request(app).get("/posts");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  test("Posts create test", async () => {
    const response = await request(app).post("/posts")
    .set("Authorization", "JWT" + userInfo.token)
    .send(testPost1);
    console.log(response.body);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.owner).toBe(userInfo._id);
    expect(post.title).toBe(testPost1.title);
    expect(post.content).toBe(testPost1.content);
    postId = post._id;
  });

  test("post get by id test", async () => { 
    const response = await request(app).get('/posts/'+postId);
    const post = response.body;
    console.log("/posts/"+postId);
    console.log(post);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
  });

  test("posts create test", async () => {
    const response = await request(app).post("/posts")
    .set("Authorization", "JWT" + userInfo.token)
    .send(testPost2);
    console.log(response.body);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.title).toBe(testPost2.title);
    expect(post.content).toBe(testPost2.content); 
    postId = post._id;
  });

  test("posts create test fail", async () => {
    const response = await request(app).post("/posts").send(testPostFail);
    expect(response.statusCode).not.toBe(201);
  });

  test("posts get posts by owner", async () => {
    const response = await request(app).get("/posts?owner=" + userInfo._id);
    const post = response.body[0];
    expect(response.statusCode).toBe(200);
    expect(post.owner).toBe(userInfo._id);
    expect(request.body.length).toBe(2);
    });

  test("posts delete test", async () => {
    const response = await request(app).delete("/posts/"+postId)
    .set("Authorization", "JWT" + userInfo.token);
    expect(response.statusCode).toBe(200);

    const response2 = await request(app).get("/posts/"+postId);
    expect(response2.statusCode).toBe(404);

  const response3 = await request(app).delete("/posts/"+postId);
  const post = response3.body;
  console.log(post);
  expect(response3.statusCode).toBe(404);
});

});
