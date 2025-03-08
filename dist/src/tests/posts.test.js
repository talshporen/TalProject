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
const posts_model_1 = __importDefault(require("../models/posts_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const userInfo = {
    email: "tal.shporen1@gmail.com",
    password: "123456"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield posts_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
    userInfo.token = response.body.token;
    userInfo._id = response.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
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
    test("Posts get all test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    }));
    test("Posts create test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts")
            .set("Authorization", "JWT" + userInfo.token)
            .send(testPost1);
        console.log(response.body);
        const post = response.body;
        expect(response.statusCode).toBe(201);
        expect(post.owner).toBe(userInfo._id);
        expect(post.title).toBe(testPost1.title);
        expect(post.content).toBe(testPost1.content);
        postId = post._id;
    }));
    test("post get by id test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/posts/' + postId);
        const post = response.body;
        console.log("/posts/" + postId);
        console.log(post);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("posts create test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts")
            .set("Authorization", "JWT" + userInfo.token)
            .send(testPost2);
        console.log(response.body);
        const post = response.body;
        expect(response.statusCode).toBe(201);
        expect(post.title).toBe(testPost2.title);
        expect(post.content).toBe(testPost2.content);
        postId = post._id;
    }));
    test("posts create test fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send(testPostFail);
        expect(response.statusCode).not.toBe(201);
    }));
    test("posts get posts by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?owner=" + userInfo._id);
        const post = response.body[0];
        expect(response.statusCode).toBe(200);
        expect(post.owner).toBe(userInfo._id);
        expect(response.body.length).toBe(2);
    }));
    test("posts delete test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId)
            .set("Authorization", "JWT" + userInfo.token);
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response2.statusCode).toBe(404);
        const response3 = yield (0, supertest_1.default)(app).delete("/posts/" + postId);
        const post = response3.body;
        console.log(post);
        expect(response3.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=posts.test.js.map