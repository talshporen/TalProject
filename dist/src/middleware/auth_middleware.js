"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).send("missing token");
        return;
    }
    if (process.env.TOKEN_SECRET) {
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, data) => {
            if (err) {
                res.status(403).send("invalid token");
                return;
            }
            const payload = data;
            req.query.userId = payload._id;
            next();
        });
    }
};
exports.authUser = authUser;
//# sourceMappingURL=auth_middleware.js.map