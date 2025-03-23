"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostsSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
        type: String,
        required: true,
    },
});
const PostModel = mongoose_1.default.model('Posts', PostsSchema);
exports.default = PostModel;
//# sourceMappingURL=posts_model.js.map