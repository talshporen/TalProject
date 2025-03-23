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
const user_model_1 = __importDefault(require("../models/user_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
const comment_model_1 = __importDefault(require("../models/comment_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const google_auth_library_1 = require("google-auth-library");
const functions_1 = require("../utils/functions");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    if (!username || !password || !email || !f_name || !l_name) {
        res.status(400).send("missing fields");
        yield (0, functions_1.deleteFileFromPath)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        return;
    }
    if (yield user_model_1.default.findOne({ email: email })) {
        res.status(401).send("email already exists");
        yield (0, functions_1.deleteFileFromPath)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        return;
    }
    if (yield user_model_1.default.findOne({ username: username })) {
        res.status(402).send("username already exists");
        yield (0, functions_1.deleteFileFromPath)((_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
        return;
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const newUser = yield user_model_1.default.create({
        username: username,
        password: hashedPassword,
        email: email,
        f_name: f_name,
        l_name: l_name,
        picture: req.file ? req.file.path : null,
        likedPosts: [],
        refreshTokens: [],
    });
    const userId = newUser._id.toString();
    const tokens = generateTokens(userId);
    if (tokens) {
        newUser.refreshTokens.push(tokens.refreshToken);
        yield newUser.save();
        res.status(200).send({
            user: newUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
});
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");
    const { code } = req.body;
    try {
        if (!code) {
            res.status(400).send("Invalid code");
            return;
        }
        const response = yield client.getToken(code);
        const ticket = yield client.verifyIdToken({
            idToken: response.tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            res.status(401).send("Invalid payload");
            return;
        }
        const email = payload.email;
        if (!email) {
            res.status(402).send("Invalid email");
            return;
        }
        const user = yield user_model_1.default.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
        });
        if (!user) {
            const newUser = yield user_model_1.default.create({
                username: (0, uuid_1.v4)(),
                password: (0, uuid_1.v4)(),
                email: email,
                f_name: payload.given_name,
                l_name: payload.family_name,
                picture: payload.picture,
                likedPosts: [],
                refreshTokens: [],
            });
            const tokens = generateTokens(newUser._id.toString());
            if (tokens) {
                newUser.refreshTokens.push(tokens.refreshToken);
                yield newUser.save();
                res.status(200).send({
                    user: newUser,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                });
            }
        }
        else {
            const tokens = generateTokens(user._id.toString());
            if (tokens) {
                user.refreshTokens.push(tokens.refreshToken);
                yield user.save();
                res.status(200).send({
                    user: user,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                });
            }
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
const generateTokens = (_id) => {
    const random = Math.floor(Math.random() * 1000000);
    let accessToken = "";
    let refreshToken = "";
    if (process.env.TOKEN_SECRET) {
        accessToken = jsonwebtoken_1.default.sign({
            _id: _id,
            random: random,
        }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        refreshToken = jsonwebtoken_1.default.sign({
            _id: _id,
            random: random,
        }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
    }
    return { accessToken, refreshToken };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(403).send("missing fields");
        return;
    }
    const user = yield user_model_1.default.findOne({ username: username });
    if (!user) {
        res.status(400).send("username or password is incorrect");
        return;
    }
    const validPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!validPassword) {
        res.status(401).send("username or password is incorrect");
        return;
    }
    const userId = user._id.toString();
    const tokens = generateTokens(userId);
    if (tokens) {
        user.refreshTokens.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            username: user.username,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(402).send("missing refresh token");
        return;
    }
    if (process.env.TOKEN_SECRET) {
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(403).send("invalid token");
                return;
            }
            const payload = data;
            const user = yield user_model_1.default.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("invalid token");
                return;
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                yield user.save();
                res.status(401).send("invalid token");
                return;
            }
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            yield user.save();
            res.status(200).send("logged out");
        }));
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(402).send("Invalid token");
        return;
    }
    if (process.env.TOKEN_SECRET) {
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(403).send("Invalid token");
                return;
            }
            const payload = data;
            const user = yield user_model_1.default.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("Invalid token");
                return;
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                yield user_model_1.default.updateOne({ _id: payload._id }, { refreshTokens: [] });
                res.status(401).send("Invalid token");
                return;
            }
            const newTokens = generateTokens(user._id.toString());
            if (newTokens) {
                yield user_model_1.default.updateOne({ _id: payload._id }, { $pull: { refreshTokens: refreshToken } });
                yield user_model_1.default.updateOne({ _id: payload._id }, {
                    $push: {
                        refreshTokens: {
                            $each: [newTokens.refreshToken],
                            $slice: -5,
                        },
                    },
                });
                res.status(200).send({
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken,
                });
            }
        }));
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user) {
            res.status(401).send("user does not exist");
            return;
        }
        res.status(200).send({
            fullname: user.f_name + " " + user.l_name,
            picture: user.picture,
        });
    }
    catch (error) {
        res.status(500).send("error");
    }
});
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const user = yield user_model_1.default.findOne({ _id: userId });
    if (!user) {
        res.status(400).send("user not found");
        return;
    }
    res.status(200).send({
        username: user.username,
        email: user.email,
        f_name: user.f_name,
        l_name: user.l_name,
        picture: user.picture,
        likedPosts: user.likedPosts,
    });
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.query.userId;
    const username = req.body.username;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const user = yield user_model_1.default.findOne({ _id: userId });
    if (!user) {
        res.status(400).send("user not found");
        yield (0, functions_1.deleteFileFromPath)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        return;
    }
    if (username) {
        if (user.username !== username) {
            const userExists = yield user_model_1.default.findOne({ username: username });
            if (userExists) {
                res.status(401).send("username already exists");
                yield (0, functions_1.deleteFileFromPath)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
                return;
            }
            user.username = username;
        }
    }
    let picture = user.picture;
    if (req.file) {
        yield (0, functions_1.deleteFileFromPath)(user.picture);
        picture = req.file.path;
        user.picture = picture;
    }
    if (f_name)
        user.f_name = f_name;
    if (l_name)
        user.l_name = l_name;
    yield user.save();
    res.status(200).send("user updated");
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const user = yield user_model_1.default.findOne({ _id: userId });
    if (!user) {
        res.status(400).send("user not found");
        return;
    }
    if (user.likedPosts.length > 0) {
        for (let i = 0; i < user.likedPosts.length; i++) {
            const post = yield post_model_1.default.findOne({ _id: user.likedPosts[i] });
            if (post) {
                post.likes = post.likes.filter((id) => id.toString() !== userId);
                yield post.save();
            }
        }
    }
    const posts = yield post_model_1.default.find({ user: userId });
    for (let i = 0; i < posts.length; i++) {
        yield (0, functions_1.deleteFileFromPath)(posts[i].picture);
        yield comment_model_1.default.deleteMany({ post: posts[i]._id });
    }
    yield post_model_1.default.deleteMany({ user: userId });
    yield (0, functions_1.deleteFileFromPath)(user.picture);
    yield comment_model_1.default.deleteMany({ user: userId });
    yield user_model_1.default.deleteOne({ _id: userId });
    res.status(200).send("user deleted");
});
exports.default = {
    register,
    googleLogin,
    login,
    logout,
    refresh,
    getUser,
    getSettings,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=user_controllers.js.map