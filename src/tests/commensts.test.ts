import request from "supertest";
import initApp from '../server';
import mongoose from 'mongoose';
import commentModel from "../models/comments_model"
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await commentModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

let commentId = "";

const testComment1 = {
  owner: "TalOwner",
  comment: "this is my first comment",
  postId: "this is my first post",
};

const testComment2 = {
  owner: "TalOwner2",
  comment: "this is my first comment2",
  postId: "this is my first post2",
};

const testCommentFail = {
  postId: "this is my first post2",
  comment: "this is my first comment2",
};

describe("Comments Tests", () => {
  
  test("Comments get all comments", async () => {
    const response = await request(app).get("/comments");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Create a valid comment", async () => {
    const response = await request(app).post("/comments").send(testComment1);
    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(testComment1.owner);
    expect(response.body.comment).toBe(testComment1.comment);
    expect(response.body.postId).toBe(testComment1.postId);
    commentId = response.body._id;
  });

  test("Fail to create a comment without owner", async () => {
    const response = await request(app).post("/comments").send(testCommentFail);
    expect(response.statusCode).not.toBe(201);
    expect(response.statusCode).toBe(400);
  });

  test("Get comment by valid ID", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(testComment1.comment);
    expect(response.body.postId).toBe(testComment1.postId);
    expect(response.body.owner).toBe(testComment1.owner);
  });

  test("Get comment by invalid ID", async () => {
    const response = await request(app).get("/comments/invalidId");
    expect(response.statusCode).toBe(400);
  });

  test("Get comments by owner", async () => {
    await request(app).post("/comments").send(testComment2); // יצירת תגובה שנייה
    const response = await request(app).get("/comments?owner=" + testComment2.owner);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0].owner).toBe(testComment2.owner);
  });

});
