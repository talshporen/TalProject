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
const userInfo = {
    username: "testuser",
    password: "testpassword",
    email: "testemail",
    f_name: "testf_name",
    l_name: "testl_name",
};
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
    userInfo.accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app).delete('/user/delete').set('Authorization', `JWT ${userInfo.accessToken}`);
    yield mongoose_1.default.connection.close();
}));
describe("Auth Tests", () => {
    test("should return 401 if no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/user/update").send(userInfo);
        expect(response.status).toBe(401);
    }));
    test("should return 403 if invalid token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put("/user/update")
            .set("Authorization", "JWT invalidtoken")
            .send(userInfo);
        expect(response.status).toBe(403);
    }));
    test("should return 200 if valid token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put("/user/update")
            .set("Authorization", "JWT " + userInfo.accessToken)
            .field("f_name", userInfo.f_name)
            .field("l_name", userInfo.l_name)
            .field("username", "newusername")
            .attach("picture", imagePath);
        expect(response.status).toBe(200);
    }));
});
//# sourceMappingURL=authmiddeleware.test.js.map