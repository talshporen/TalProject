"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
//import PostModel from "../models/posts_model";
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const userInfo = {
    email: "tal.shporen1@gmail.com",
    password: "123456"
};
describe("Auth test", () => {
    test("auth registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).toBe(200);
    }));
    test("auth registration fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).not.toBe(200);
    }));
    test("auth login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
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
    }));
    test("make sure two access tokens are different", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
    }));
    test("get protected API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            owner: "invalid owner",
            title: "my first post",
            content: "this is my first post",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt' + userInfo.accessToken
        }).send({
            owner: "invalid owner",
            title: "my first post",
            content: "this is my first post",
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("get protected API invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt' + userInfo.accessToken + "1"
        }).send({
            owner: userInfo._id,
            title: "my first post",
            content: "this is my first post",
        });
        expect(response.statusCode).not.toBe(201);
    }));
    const refreshTokenTest = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken;
        userInfo.refreshToken = response.body.refreshToken;
    });
    test("refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        refreshTokenTest();
    }));
    test("refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        refreshTokenTest();
    }));
    test("logout - invalidate", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).not.toBe(200);
    }));
    test("refresh token multiple times", () => __awaiter(void 0, void 0, void 0, function* () {
        //login - get a refresh token
        refreshTokenTest();
        // first time use the refresh token and get a new one
        const response2 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).toBe(200);
        const newRefreshToken = response2.body.refreshToken;
        // second time use the old refresh token and expect to fail
        const response3 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).not.toBe(200);
        //try to use the new refresh token and expect to fail
        const response4 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: newRefreshToken
        });
        expect(response4.statusCode).not.toBe(200);
    }));
});
//# sourceMappingURL=auth.test.js.map