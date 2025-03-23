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
const commentInfo = {
    content: "testcomment",
};
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
    const response = yield (0, supertest_1.default)(app)
        .post("/user/register")
        .field("f_name", userInfo.f_name)
        .field("l_name", userInfo.l_name)
        .field("email", userInfo.email)
        .field("username", userInfo.username)
        .field("password", userInfo.password)
        .attach("picture", imagePath);
    userInfo._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/user/login").send({
        username: userInfo.username,
        password: userInfo.password,
    });
    userInfo.accessToken = response2.body.accessToken;
    const response3 = yield (0, supertest_1.default)(app)
        .post("/post")
        .set("Authorization", `JWT ${userInfo.accessToken}`)
        .field("title", postInfo.title)
        .field("description", postInfo.description)
        .field("category", postInfo.category)
        .field("phone", postInfo.phone)
        .field("region", postInfo.region)
        .field("city", postInfo.city)
        .attach("picture", imagePath);
    postInfo._id = response3.body._id;
    commentInfo.post = postInfo._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app).delete('/user/delete').set('Authorization', `JWT ${userInfo.accessToken}`);
    yield mongoose_1.default.connection.close();
}));
describe("Comment Tests", () => {
    test("Create Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comment")
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send(commentInfo);
        commentInfo._id = response.body._id;
        expect(response.status).toBe(201);
    }));
    test("Create Comment with invalid post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comment")
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send(Object.assign(Object.assign({}, commentInfo), { post: fakeId }));
        expect(response.status).toBe(400);
    }));
    test("Get All Comments By Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comment/post/${postInfo._id}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Get all comments by post fail - no data found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comment/post/${fakeId}`);
        expect(response.status).toBe(404);
    }));
    test("Get all comments by post fail - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comment/post/invalidid`);
        expect(response.status).toBe(400);
    }));
    test("Get Comment By Id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comment/${commentInfo._id}`);
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(commentInfo.content);
    }));
    test("Get Comment By Id fail - no data found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comment/${fakeId}`);
        expect(response.status).toBe(404);
    }));
    test("Get Comment By Id fail - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comment/invalidid`);
        expect(response.status).toBe(400);
    }));
    test("Update Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comment/${commentInfo._id}`)
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send({ content: "updatedcontent" });
        expect(response.status).toBe(200);
        expect(response.body.content).toBe("updatedcontent");
    }));
    test("Update Comment fail - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comment/invalidid`)
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send({ content: "updatedcontent" });
        expect(response.status).toBe(400);
    }));
    test("Update Comment fail - no data found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comment/${fakeId}`)
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send({ content: "updatedcontent" });
        expect(response.status).toBe(404);
    }));
    test("Update Comment fail - cannot update post or user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comment/${commentInfo._id}`)
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send({ content: "updatedcontent", post: fakeId });
        expect(response.status).toBe(403);
    }));
    test("Delete Comment fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comment/${fakeId}`)
            .set("Authorization", "JWT " + userInfo.accessToken);
        expect(response.status).toBe(404);
    }));
    test("Delete Comment fail - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comment/invalidid`)
            .set("Authorization", "JWT " + userInfo.accessToken);
        expect(response.status).toBe(400);
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comment/${commentInfo._id}`)
            .set("Authorization", "JWT " + userInfo.accessToken);
        expect(response.status).toBe(200);
    }));
});
//# sourceMappingURL=commenst.test.js.map