import request  from "supertest";
import initApp from '../server';
import mongoose from 'mongoose';
import postModel from "../models/posts_model";
import  { Express } from "express";

let app:Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await postModel.deleteMany();
});

afterAll(async() => {
  console.log("afterAll");
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
  title: "Mt first post 2", 
  content: "this is my first post",};

describe("Posts Tests", () => {
  test("Posts get all test", async () => {
    const response = await request(app).get("/posts");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  test("Posts create test", async () => {
    const response = await request(app).post("/posts").send(testPost1);
    console.log(response.body);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.title).toBe(testPost1.title);
    expect(post.content).toBe(testPost1.content);
    expect(post.owner).toBe(testPost1.owner);
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
    const response = await request(app).post("/posts").send(testPost2);
    console.log(response.body);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.title).toBe(testPost2.title);
    expect(post.content).toBe(testPost2.content); 
    expect(post.owner).toBe(testPost2.owner);
    postId = post._id;
  });

  test("posts create test fail", async () => {
    const response = await request(app).post("/posts").send(testPostFail);
    expect(response.statusCode).toBe(400);
  });

  test("posts get posts by owner", async () => {
    const response = await request(app).get("/posts?owner=" + testPost1.owner);
    expect(response.statusCode).toBe(200);
    expect(testPost1.owner).toBe(testPost1.owner);
    });
  });

  test("posts delete test", async () => {
    const response = await request(app).delete("/posts/"+postId);
    expect(response.statusCode).toBe(200);

    const response2 = await request(app).get("/posts/"+postId);
    expect(response2.statusCode).toBe(404);
  });
