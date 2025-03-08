import request  from "supertest";
import initApp from '../server';
import mongoose from 'mongoose';
import userModel from "../models/user_model";
import  { Express } from "express";
//import PostModel from "../models/posts_model";

let app:Express;

beforeAll(async () => {
  app = await initApp();
 await userModel.deleteMany();
});

afterAll(async() => {
  await mongoose.connection.close();
});

type UserInfo = {
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;
    _id?: string;
    };
const userInfo:UserInfo = {
  email: "tal.shporen1@gmail.com",
  password:"123456"    
}

describe("Auth test", () => {
  test("auth registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).toBe(200);
  });


  test("auth registration fail", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).not.toBe(200);
  });

  test("auth login", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    const userId = response.body._id;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(userId).toBeDefined();
    userInfo.accessToken = accessToken;
    userInfo.refreshToken = refreshToken;
    userInfo._id = userId;
  });

  test("make sure two access tokens are different", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password
    });
    expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
  });


  test("get protected API", async () => {
    const response = await request(app).post("/posts").send({
        owner: "invalid owner",
        title: "my first post",
        content: "this is my first post",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app).post("/posts").set({
        authorization: 'jwt' + userInfo.accessToken
    }).send({
        owner: "invalid owner",
        title: "my first post",
        content: "this is my first post",
    });
    expect(response2.statusCode).toBe(201);
});



test("get protected API invalid token", async () => {
  const response = await request(app).post("/posts").set({
      authorization: 'jwt' + userInfo.accessToken+"1"
  }).send({
      owner: userInfo._id,
      title: "my first post",
      content: "this is my first post",
  });
  expect(response.statusCode).not.toBe(201);

}); 

const refreshTokenTest = async() => {
  const response = await request(app).post("/auth/login").send({
    email: userInfo.email,
    password: userInfo.password
  });
  expect(response.statusCode).toBe(200);
  expect(response.body.accessToken).toBeDefined();
  expect(response.body.refreshToken).toBeDefined();
  userInfo.accessToken = response.body.accessToken;
  userInfo.refreshToken = response.body.refreshToken;
 }

test("refresh token", async () => {
  refreshTokenTest();
});
test("refresh token", async () => {
  refreshTokenTest();
});


 test ("logout - invalidate", async () => {
  const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken
  });
  expect(response.statusCode).toBe(200);
  const response2 = await request(app).post("/auth/refresh").send({
    refreshToken: userInfo.refreshToken 
  });
  expect(response2.statusCode).not.toBe(200);
});
test("refresh token multiple times", async () => {
  //login - get a refresh token
refreshTokenTest();

// first time use the refresh token and get a new one
  const response2 = await request(app).post("/auth/refresh").send({
    refreshToken: userInfo.refreshToken
  });
  expect(response2.statusCode).toBe(200);
  const newRefreshToken = response2.body.refreshToken;

  // second time use the old refresh token and expect to fail
  const response3 = await request(app).post("/auth/refresh").send({
    refreshToken:userInfo.refreshToken
  });
  expect(response3.statusCode).not.toBe(200);

  //try to use the new refresh token and expect to fail
  const response4 = await request(app).post("/auth/refresh").send({
    refreshToken: newRefreshToken
  });
  expect(response4.statusCode).not.toBe(200);

});
});
