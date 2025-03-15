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
const path_1 = __importDefault(require("path"));
let app;
const postInfo = {
    title: "testtitle",
    description: "testdescription",
    category: "testcategory",
    phone: "testphone",
    region: "testregion",
    city: "testcity",
};
const userInfo = {
    username: "testuser",
    password: "testpassword",
    email: "testemail",
    f_name: "testf_name",
    l_name: "testl_name",
};
const fakeId = "60f7b4f3bbedb00000000000";
const imagePath = path_1.default.join(__dirname, "assets", "trash.png");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield (0, supertest_1.default)(app)
        .post("/user/register")
        .field("f_name", userInfo.f_name)
        .field("l_name", userInfo.l_name)
        .field("email", userInfo.email)
        .field("username", userInfo.username)
        .field("password", userInfo.password)
        .attach("picture", imagePath);
    const response = yield (0, supertest_1.default)(app).post("/user/login").send({
        username: userInfo.username,
        password: userInfo.password,
    });
    userInfo.refreshTokens = response.body.refreshToken;
    userInfo.accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Post Tests", () => {
    test("Create Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/post")
            .set("Authorization", `JWT ${userInfo.accessToken}`)
            .field("title", postInfo.title)
            .field("description", postInfo.description)
            .field("category", postInfo.category)
            .field("phone", postInfo.phone)
            .field("region", postInfo.region)
            .field("city", postInfo.city)
            .attach("picture", imagePath);
        expect(response.status).toBe(200);
        postInfo._id = response.body._id;
    }));
    test("Create Post without all fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/post")
            .set("Authorization", `JWT ${userInfo.accessToken}`)
            .field("title", postInfo.title);
        expect(response.status).toBe(400);
    }));
    test("Get Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post");
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.status).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).get("/post?category=testcategory");
        expect(response2.body.data.length).toBeGreaterThan(0);
        expect(response2.status).toBe(200);
    }));
    test("Get Post by catagory fail - no data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post?category=category");
        expect(response.status).toBe(404);
    }));
    test("Get Post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/post/${postInfo._id}`);
        expect(response.body.title).toBe(postInfo.title);
        expect(response.status).toBe(200);
    }));
    test("Get Post by id fail - no data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/post/${fakeId}`);
        expect(response.status).toBe(404);
    }));
    test("Get Post by id fail - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/post/invalidId`);
        expect(response.status).toBe(400);
    }));
    test("Get Feed Posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post/feed");
        expect(response.body.tops.length).toBeGreaterThan(0);
        expect(response.status).toBe(200);
    }));
    test("Post like", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/post/${postInfo._id}/like`)
            .set("Authorization", `JWT ${userInfo.accessToken}`);
        expect(response.status).toBe(200);
    }));
    test("Post unlike", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/post/${postInfo._id}/like`)
            .set("Authorization", `JWT ${userInfo.accessToken}`);
        expect(response.status).toBe(200);
    }));
    test("Post like fail - Fake post id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/post/${fakeId}/like`)
            .set("Authorization", `JWT ${userInfo.accessToken}`);
        expect(response.status).toBe(404);
    }));
    test("Post like fail - User doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", `JWT ${userInfo.accessToken}`);
        const response = yield (0, supertest_1.default)(app)
            .post(`/post/${postInfo._id}/like`)
            .set("Authorization", `JWT ${userInfo.accessToken}`);
        expect(response.status).toBe(403);
    }));
    test("Update Post", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post("/user/register")
            .field("f_name", userInfo.f_name)
            .field("l_name", userInfo.l_name)
            .field("email", userInfo.email)
            .field("username", userInfo.username)
            .field("password", userInfo.password)
            .attach("picture", imagePath);
        const response = yield (0, supertest_1.default)(app).post("/user/login").send({
            username: userInfo.username,
            password: userInfo.password,
        });
        userInfo.refreshTokens = response.body.refreshToken;
        userInfo.accessToken = response.body.accessToken;
        const response2 = yield (0, supertest_1.default)(app)
            .post("/post")
            .set("Authorization", `JWT ${userInfo.accessToken}`)
            .field("title", postInfo.title)
            .field("description", postInfo.description)
            .field("category", postInfo.category)
            .field("phone", postInfo.phone)
            .field("region", postInfo.region)
            .field("city", postInfo.city)
            .attach("picture", imagePath);
        postInfo._id = response2.body._id;
        const response3 = yield (0, supertest_1.default)(app)
            .put(`/post/${postInfo._id}`)
            .set("Authorization", `JWT ${userInfo.accessToken}`)
            .field("title", "updatedtitle")
            .field("description", postInfo.description)
            .field("category", postInfo.category)
            .field("phone", postInfo.phone)
            .field("region", postInfo.region)
            .field("city", postInfo.city)
            .attach("picture", imagePath);
        expect(response3.status).toBe(200);
        expect(response3.body.title).toBe("updatedtitle");
    }));
    test("Update Post fail - Fake post id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/post/${fakeId}`)
            .set("Authorization", `JWT ${userInfo.accessToken}`)
            .field("title", "updatedtitle")
            .field("description", postInfo.description)
            .field("category", postInfo.category)
            .field("phone", postInfo.phone)
            .field("region", postInfo.region)
            .field("city", postInfo.city)
            .attach("picture", imagePath);
        expect(response.status).toBe(400);
    }));
    test("Update Post fail - tried to update likes", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/post/${postInfo._id}`)
            .set("Authorization", `JWT ${userInfo.accessToken}`)
            .field("title", "updatedtitle")
            .field("description", postInfo.description)
            .field("likes", ["test"])
            .field("category", postInfo.category)
            .field("phone", postInfo.phone)
            .field("region", postInfo.region)
            .field("city", postInfo.city)
            .attach("picture", imagePath);
        expect(response.status).toBe(403);
    }));
    test("Delete Post fail - invalid post id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/post/invalidId`)
            .set("Authorization", `JWT ${userInfo.accessToken}`);
        expect(response.status).toBe(400);
    }));
    test("Delete Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/post/${postInfo._id}`)
            .set("Authorization", `JWT ${userInfo.accessToken}`);
        expect(response.status).toBe(200);
        yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", `JWT ${userInfo.accessToken}`);
    }));
});
//# sourceMappingURL=post.test.js.map