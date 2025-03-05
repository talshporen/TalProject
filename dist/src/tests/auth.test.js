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
        const token = response.body.token;
        expect(token).toBeDefined();
        const userId = response.body._id;
        expect(userId).toBeDefined();
        userInfo.token = token;
        userInfo._id = userId;
    }));
    test("get protected API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            owner: userInfo._id,
            title: "my first post",
            content: "this is my first post",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt' + userInfo.token
        }).send({
            owner: userInfo._id,
            title: "my first post",
            content: "this is my first post",
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("get protected API invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt' + userInfo.token + "1"
        }).send({
            owner: userInfo._id,
            title: "my first post",
            content: "this is my first post",
        });
        expect(response.statusCode).not.toBe(201);
    }));
});
//# sourceMappingURL=auth.test.js.map