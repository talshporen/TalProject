"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const globals_1 = require("@jest/globals");
const path = __importStar(require("path"));
let app;
const postInfo = {
    title: "testtitle",
    description: "testdescription",
    category: "testcatagoery",
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
const userInfo2 = {
    username: "testuser2",
    password: "testpassword2",
    email: "testemail2",
    f_name: "testf_name2",
    l_name: "testl_name2",
};
const fakeId = "60f1b0e4c9e3f1b3b4c9e3f1";
const imagePath = path.join(__dirname, "assets", "trash.png");
(0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
(0, globals_1.describe)("Users Tests", () => {
    test("should return 200 if user created - register", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/user/register")
            .field("f_name", userInfo.f_name)
            .field("l_name", userInfo.l_name)
            .field("email", userInfo.email)
            .field("username", userInfo.username)
            .field("password", userInfo.password)
            .attach("picture", imagePath);
        (0, globals_1.expect)(res.statusCode).toEqual(200);
    }));
    test("register fail - should return 400 if missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/user/register")
            .field("f_name", userInfo.f_name)
            .field("l_name", userInfo.l_name)
            .field("email", userInfo.email)
            .field("username", userInfo.username);
        (0, globals_1.expect)(response.status).toBe(400);
    }));
    test("register fail - should return 401 if email already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/user/register")
            .field("f_name", userInfo.f_name)
            .field("l_name", userInfo.l_name)
            .field("email", userInfo.email)
            .field("username", userInfo.username)
            .field("password", userInfo.password)
            .attach("picture", imagePath);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
    test("register fail - should return 402 if username already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/user/register")
            .field("f_name", userInfo.f_name)
            .field("l_name", userInfo.l_name)
            .field("email", userInfo2.email)
            .field("username", userInfo.username)
            .field("password", userInfo.password)
            .attach("picture", imagePath);
        (0, globals_1.expect)(res.status).toBe(402);
    }));
    test("Google login fail - should return 400 if missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user/googleLogin").send({});
        (0, globals_1.expect)(response.status).toBe(400);
    }));
    test("login success - should return 200 if user is logged in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user/login").send({
            username: userInfo.username,
            password: userInfo.password,
        });
        userInfo.refreshTokens = response.body.refreshToken;
        userInfo.accessToken = response.body.accessToken;
        (0, globals_1.expect)(response.status).toBe(200);
    }));
    test("login fail - should return 400 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/user/login")
            .send({
            username: userInfo.username + "wrong",
            password: userInfo.password,
        });
        (0, globals_1.expect)(response.status).toBe(400);
    }));
    test("login fail - should return 401 if password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user/login").send({
            username: userInfo.username,
            password: "wrongpassword",
        });
        (0, globals_1.expect)(response.status).toBe(401);
    }));
    test("login fail - should return 403 if missing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user/login").send({
            username: userInfo.username,
        });
        (0, globals_1.expect)(response.status).toBe(403);
    }));
    test("logout success - should return 200 if user is logged out", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/user/logout")
            .send({ refreshToken: userInfo.refreshTokens });
        (0, globals_1.expect)(response2.status).toBe(200);
    }));
    test("logout fail - should return 402 missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user/logout").send({});
        (0, globals_1.expect)(response.status).toBe(402);
    }));
    test("logout fail - should return 403 if invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/user/logout")
            .send({ refreshToken: userInfo.refreshTokens + "wrong" });
        (0, globals_1.expect)(response2.status).toBe(403);
    }));
    test("logout fail - should return 401 if user is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/user/logout")
            .send({ refreshToken: userInfo.refreshTokens });
        (0, globals_1.expect)(response2.status).toBe(401);
    }));
    test("logout fail - should return 400 if the token is of deleted user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", "JWT " + userInfo.accessToken);
        const response2 = yield (0, supertest_1.default)(app)
            .post("/user/logout")
            .send({ refreshToken: userInfo.refreshTokens });
        (0, globals_1.expect)(response2.status).toBe(400);
    }));
    test("refresh success - should return 200 if token is refreshed", () => __awaiter(void 0, void 0, void 0, function* () {
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
            .post("/user/refresh")
            .send({ refreshToken: userInfo.refreshTokens });
        (0, globals_1.expect)(response2.status).toBe(200);
    }));
    test("refresh fail - should return 402 if missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user/refresh").send({});
        (0, globals_1.expect)(response.status).toBe(402);
    }));
    test("refresh fail - should return 403 if invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/user/refresh")
            .send({ refreshToken: userInfo.refreshTokens + "wrong" });
        (0, globals_1.expect)(response2.status).toBe(403);
    }));
    test("refresh fail - should return 401 if refresh token is not in the database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.updateOne({ username: userInfo.username }, { $pull: { refreshTokens: userInfo.refreshTokens } });
        const response2 = yield (0, supertest_1.default)(app)
            .post("/user/refresh")
            .send({ refreshToken: userInfo.refreshTokens });
        (0, globals_1.expect)(response2.status).toBe(401);
        yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", "JWT " + userInfo.accessToken);
    }));
    test("refresh fail - should return 400 if user is deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/user/refresh")
            .send({ refreshToken: userInfo.refreshTokens });
        (0, globals_1.expect)(response2.status).toBe(400);
    }));
    test("Get user fail - should return 500 id not in format", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/" + userInfo.username);
        (0, globals_1.expect)(response.status).toBe(500);
    }));
    test("Get user fail - should return 401 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/" + fakeId);
        (0, globals_1.expect)(response.status).toBe(401);
    }));
    test("Get user success - should return 200 if user exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/user/register")
            .field("f_name", userInfo.f_name)
            .field("l_name", userInfo.l_name)
            .field("email", userInfo.email)
            .field("username", userInfo.username)
            .field("password", userInfo.password)
            .attach("picture", imagePath);
        userInfo._id = res.body.user._id;
        const response2 = yield (0, supertest_1.default)(app).get("/user/" + userInfo._id);
        (0, globals_1.expect)(response2.status).toBe(200);
    }));
    test("Get user settings success - should return 200 if users are found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user/login").send({
            username: userInfo.username,
            password: userInfo.password,
        });
        (0, globals_1.expect)(response.status).toBe(200);
        userInfo.accessToken = response.body.accessToken;
        const response2 = yield (0, supertest_1.default)(app)
            .get("/user/auth/settings")
            .set("Authorization", "JWT " + userInfo.accessToken);
        (0, globals_1.expect)(response2.status).toBe(200);
        yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", "JWT " + userInfo.accessToken);
    }));
    test("Get user settings fail - should return 400 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response3 = yield (0, supertest_1.default)(app)
            .get("/user/auth/settings")
            .set("Authorization", "JWT " + userInfo.accessToken);
        (0, globals_1.expect)(response3.status).toBe(400);
    }));
    test("Update user success - should return 200 if user is updated", () => __awaiter(void 0, void 0, void 0, function* () {
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
        userInfo.accessToken = response.body.accessToken;
        const response2 = yield (0, supertest_1.default)(app)
            .put("/user/update")
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send(Object.assign(Object.assign({}, userInfo), { username: "newusername" }));
        (0, globals_1.expect)(response2.status).toBe(200);
    }));
    test("Update user fail - should return 401 if username you are trying to update are already in the system", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post("/user/register")
            .field("f_name", userInfo2.f_name)
            .field("l_name", userInfo2.l_name)
            .field("email", userInfo2.email)
            .field("username", userInfo2.username)
            .field("password", userInfo2.password)
            .attach("picture", imagePath);
        const response = yield (0, supertest_1.default)(app).post("/user/login").send({
            username: userInfo2.username,
            password: userInfo2.password,
        });
        userInfo2.accessToken = response.body.accessToken;
        const response2 = yield (0, supertest_1.default)(app)
            .put("/user/update")
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send(Object.assign(Object.assign({}, userInfo), { username: userInfo2.username }));
        (0, globals_1.expect)(response2.status).toBe(401);
    }));
    test("Update user fail - should return 400 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", "JWT " + userInfo.accessToken);
        const response3 = yield (0, supertest_1.default)(app)
            .put("/user/update")
            .set("Authorization", "JWT " + userInfo.accessToken)
            .send(userInfo);
        (0, globals_1.expect)(response3.status).toBe(400);
    }));
    test("Delete user fail - should return 400 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response3 = yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", "JWT " + userInfo.accessToken);
        (0, globals_1.expect)(response3.status).toBe(400);
    }));
    test("Delete user success - should return 200 if user is deleted and removed likes on post", () => __awaiter(void 0, void 0, void 0, function* () {
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
        userInfo.accessToken = response.body.accessToken;
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
        (0, globals_1.expect)(response3.status).toBe(200);
        const response4 = yield (0, supertest_1.default)(app)
            .post(`/post/${postInfo._id}/like`)
            .set("Authorization", `JWT ${userInfo2.accessToken}`);
        (0, globals_1.expect)(response4.status).toBe(200);
        const response5 = yield (0, supertest_1.default)(app).get(`/post/${postInfo._id}`);
        (0, globals_1.expect)(response5.body.likes.length).toBe(1);
        userInfo.accessToken = response.body.accessToken;
        const response2 = yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", "JWT " + userInfo2.accessToken);
        (0, globals_1.expect)(response2.status).toBe(200);
        const response6 = yield (0, supertest_1.default)(app).get(`/post/${postInfo._id}`);
        (0, globals_1.expect)(response6.body.likes.length).toBe(0);
        yield (0, supertest_1.default)(app)
            .delete("/user/delete")
            .set("Authorization", "JWT " + userInfo.accessToken);
    }));
});
//# sourceMappingURL=user.test.js.map