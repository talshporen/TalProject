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
const Post_1 = __importDefault(require("../models/Post"));
const Users_1 = __importDefault(require("../models/Users"));
const testUser = {
    email: "test@user.com",
    password: "testpassword",
    username: "testuser",
};
let server;
let authToken;
let testUserId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = yield (0, server_1.default)();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Post_1.default.deleteMany({});
    yield Users_1.default.deleteMany({});
    // Регистрируем и логиним тестового пользователя
    yield (0, supertest_1.default)(server).post("/auth/register").send(testUser);
    const loginRes = yield (0, supertest_1.default)(server).post("/auth/login").send({
        email: testUser.email,
        password: testUser.password,
    });
    expect(loginRes.statusCode).toBe(200);
    authToken = loginRes.body.accessToken;
    testUserId = loginRes.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.close();
    yield mongoose_1.default.disconnect();
}));
describe("Additional Posts Tests", () => {
    test("should not create a post without required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "All fields are required");
    }));
    test("should not allow uploading an invalid image format", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .field("title", "Test")
            .field("content", "Content")
            .field("author", testUserId)
            .attach("image", Buffer.from("test"), { filename: "test.txt", contentType: "text/plain" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Only JPEG or PNG files are allowed");
    }));
    test("should return 404 for a non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).get("/posts/654321abcdef123456789abc");
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Post not found");
    }));
    test("should not update a non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .put("/posts/654321abcdef123456789abc")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ title: "Updated", content: "Updated content" });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Post not found");
    }));
    test("should not update a post without required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ title: "Test", content: "Test content", author: testUserId });
        const postId = createRes.body._id;
        const response = yield (0, supertest_1.default)(server)
            .put(`/posts/${postId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Title and content are required");
    }));
    test("should return 404 when deleting a non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .delete("/posts/654321abcdef123456789abc")
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Post not found");
    }));
    test("should return 404 when liking a non-existent post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .post("/posts/654321abcdef123456789abc/like?userId=" + testUserId)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Post not found");
    }));
    test("should return 401 if userId is missing when liking a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ title: "Test Post", content: "Test content", author: testUserId });
        const postId = createRes.body._id;
        // Append an empty userId query parameter
        const response = yield (0, supertest_1.default)(server)
            .post(`/posts/${postId}/like/${""}`);
        expect(response.statusCode).toBe(401);
    }));
    test("should correctly increase and decrease likes count", () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ title: "Test Post", content: "Test content", author: testUserId });
        const postId = createRes.body._id;
        // Like the post
        const likeRes1 = yield (0, supertest_1.default)(server)
            .post(`/posts/${postId}/like?userId=${testUserId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(likeRes1.statusCode).toBe(200);
        expect(likeRes1.body).toHaveProperty("likesCount", 1);
        // Unlike the post
        const likeRes2 = yield (0, supertest_1.default)(server)
            .post(`/posts/${postId}/like?userId=${testUserId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(likeRes2.statusCode).toBe(200);
        expect(likeRes2.body).toHaveProperty("likesCount", 0);
    }));
    test("should return 404 when no posts found for the given sender ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .get(`/posts/sender/${new mongoose_1.default.Types.ObjectId()}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "No posts found for this sender");
    }));
    test("should return 500 if there is a database error", () => __awaiter(void 0, void 0, void 0, function* () {
        // סימולציה של תקלה במסד נתונים
        jest.spyOn(Post_1.default, "find").mockRejectedValue(new Error("Database error"));
        const response = yield (0, supertest_1.default)(server)
            .get(`/posts/sender/${testUserId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty("message", "Error getting posts by sender ID");
        // שחזור הפונקציה המקורית
        jest.restoreAllMocks();
    }));
    test("should return 404 when senderId is not a valid ObjectId", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .get("/posts/sender/invalid-id")
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(404); // Mongo יגרום לשגיאה בגלל ObjectId לא חוקי
    }));
    test("should allow creating a post without an image", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            title: "Test Post Without Image",
            content: "Test Content",
            author: testUserId,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).not.toHaveProperty("imagePath");
    }));
    test("should return 500 if an unexpected error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(Post_1.default, "findById").mockImplementationOnce(() => {
            throw new Error("Database connection error");
        });
        const createRes = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ title: "Test Post", content: "Test content", author: testUserId });
        const postId = createRes.body._id;
        const response = yield (0, supertest_1.default)(server)
            .post(`/posts/${postId}/like?userId=${testUserId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty("message", "Internal server error");
    }));
    test("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(Users_1.default, "findById").mockResolvedValueOnce(null);
        const createRes = yield (0, supertest_1.default)(server)
            .post("/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ title: "Test Post", content: "Test content", author: testUserId });
        const postId = createRes.body._id;
        const response = yield (0, supertest_1.default)(server)
            .post(`/posts/${postId}/like?userId=${testUserId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "User not found");
        jest.restoreAllMocks(); // מחזיר את הפונקציה למצבה המקורי
    }));
    test("should return 500 if there is a server error during deletion", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(Post_1.default, "findByIdAndDelete").mockRejectedValueOnce(new Error("Database error"));
        const response = yield (0, supertest_1.default)(server)
            .delete(`/posts/${testUserId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty("message", "Error deleting post");
        expect(response.body).toHaveProperty("error", "Database error");
        jest.restoreAllMocks(); // מנקה את ה-mock אחרי הבדיקה
    }));
});
//# sourceMappingURL=post.test.js.map