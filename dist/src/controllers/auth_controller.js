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
exports.authMiddleware = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_model_1.default.create({
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const generateToken = (userId) => {
    try {
        const tokenSecret = process.env.TOKEN_SECRET;
        const tokenExpiration = process.env.TOKEN_EXPIRATION || '1h';
        const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '7d';
        if (!tokenSecret) {
            throw new Error('TOKEN_SECRET is not defined');
        }
        const random = Math.random().toString();
        const accessToken = jsonwebtoken_1.default.sign({ _id: userId, random: random }, tokenSecret, { expiresIn: tokenExpiration });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: userId, random: random }, tokenSecret, { expiresIn: refreshTokenExpiration });
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }
    catch (err) {
        console.error("error in generateToken", err);
        return null;
    }
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        const tokens = generateToken(user._id.toString());
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        if (!refreshToken) {
            reject("fail");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            reject("fail");
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject("fail");
                return;
            }
            const userId = payload._id;
            try {
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    reject("fail");
                    return;
                }
                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    yield user.save();
                    reject("fail");
                    return;
                }
                const tokens = user.refreshToken.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;
                resolve(user);
            }
            catch (err) {
                reject("fail");
                return;
            }
        }));
    });
};
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyRefreshToken(req.body.refreshToken);
        yield user.save();
        res.status(200).send("success");
    }
    catch (err) {
        res.status(400).send("fail");
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id
        });
    }
    catch (err) {
        res.status(400).send("fail");
    }
});
const authMiddleware = (req, res, next) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];
    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = payload._id;
        next();
    });
};
exports.authMiddleware = authMiddleware;
exports.default = {
    register,
    login,
    refresh,
    logout
};
//# sourceMappingURL=auth_controller.js.map