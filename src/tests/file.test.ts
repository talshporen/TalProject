import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";


let app: Express;

beforeAll(async () => {
    app = await initApp();

});

afterAll(async () => {
    await mongoose.connection.close();

});

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/test_file.txt`;
        console.log(filePath);
        try {
            const response = await request(app)
                .post("/file")
                .attach("file", filePath);
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^https?:\/\/[^/]+/, "");
            const res = await request(app).get(url);
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.error(err);
            expect(1).toEqual(2);
        }
    });
});
