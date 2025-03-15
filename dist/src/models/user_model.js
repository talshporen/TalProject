"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    f_name: {
        type: String,
        required: true,
    },
    l_name: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: "",
    },
    likedPosts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        },
    ],
    refreshTokens: {
        type: [String],
        default: [],
    },
});
const userModel = mongoose_1.default.model("Users", userSchema, "app_users");
exports.default = userModel;
//# sourceMappingURL=user_model.js.map