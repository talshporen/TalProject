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
const comments_model_1 = __importDefault(require("../models/comments_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log("beforeAll");
    yield comments_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
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
    test("Comments get all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    test("Create a valid comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testComment1);
        console.log(response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(testComment1.owner);
        expect(response.body.comment).toBe(testComment1.comment);
        expect(response.body.postId).toBe(testComment1.postId);
        commentId = response.body._id;
    }));
    test("Fail to create a comment without owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testCommentFail);
        expect(response.statusCode).not.toBe(201);
        expect(response.statusCode).toBe(400);
    }));
    test("Get comment by valid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(testComment1.comment);
        expect(response.body.postId).toBe(testComment1.postId);
        expect(response.body.owner).toBe(testComment1.owner);
    }));
    test("Get comment by invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/invalidId");
        expect(response.statusCode).toBe(400);
    }));
    test("Get comments by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post("/comments").send(testComment2); // יצירת תגובה שנייה
        const response = yield (0, supertest_1.default)(app).get("/comments?owner=" + testComment2.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].owner).toBe(testComment2.owner);
    }));
});
//# sourceMappingURL=commensts.test.js.map