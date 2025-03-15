"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const commentsSchema = new Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
    },
    content: {
        type: String,
        required: true,
    },
});
const Comments = mongoose_1.default.model("Comments", commentsSchema);
exports.default = Comments;
//# sourceMappingURL=comment_model.js.map