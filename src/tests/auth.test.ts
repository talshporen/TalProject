import request  from "supertest";
import initApp from '../server';
import mongoose from 'mongoose';
import userModel from "../models/user_model";
import  { Express } from "express";



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
    token?: string;
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
    const token = response.body.token;
    expect(token).toBeDefined();
    const userId = response.body._id;
    expect(userId).toBeDefined();
    userInfo.token = token;
    userInfo._id = userId;
  });
  test("get protected API", async () => {
    const response = await request(app).post("/posts").send({
        owner: userInfo._id,
        title: "my first post",
        content: "this is my first post",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app).post("/posts").set({
        authorization: 'jwt' + userInfo.token
    }).send({
        owner: userInfo._id,
        title: "my first post",
        content: "this is my first post",
    });
    expect(response2.statusCode).toBe(201);
});



test("get protected API invalid token", async () => {
  const response = await request(app).post("/posts").set({
      authorization: 'jwt' + userInfo.token+"1"
  }).send({
      owner: userInfo._id,
      title: "my first post",
      content: "this is my first post",
  });
  expect(response.statusCode).not.toBe(201);

}); 

 });
