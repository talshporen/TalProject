const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

beforeAll (() => {
  console.log('before all tests');
});

afterAll (() => {
  console.log('after all tests');
  mongoose.connection.close();
});

describe("posts Test", () => {
    test("Test 1",async()=>{
        const response = await request(app).get('/posts');
        expect(response.statusCode).toBe(200);

    });
});
