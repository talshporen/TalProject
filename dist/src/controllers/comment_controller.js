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
const comment_model_1 = __importDefault(require("../models/comment_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.userId;
    const comment = Object.assign({ user: _id }, req.body);
    req.body = comment;
    try {
        const data = yield comment_model_1.default.create(req.body);
        const post = yield post_model_1.default.findById(req.body.post);
        const commentId = data._id;
        if (post) {
            post.comments.push(commentId);
            yield post.save();
        }
        res.status(201).send(data);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getAllCommentsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.postId;
    try {
        const data = yield comment_model_1.default.find({ post: id });
        if (data.length > 0) {
            res.status(200).send(data);
            return;
        }
        else {
            res.status(404).send("item not found");
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
        return;
    }
});
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.commentId;
    try {
        const data = yield comment_model_1.default.findById(id);
        if (data) {
            res.status(200).send(data);
            return;
        }
        else {
            res.status(404).send("item not found");
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
        return;
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.commentId;
    const post = req.body.post;
    const user = req.body.user;
    if (post || user) {
        res.status(403).send("Cannot update postId or userId");
        return;
    }
    try {
        const data = yield comment_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (data) {
            res.status(200).send(data);
            return;
        }
        else {
            res.status(404).send("item not found");
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
        return;
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.commentId;
    try {
        const comment = yield comment_model_1.default.findById(id);
        if (comment) {
            const post = yield post_model_1.default.findById(comment.post);
            if (post) {
                post.comments = post.comments.filter((comment) => comment.toString() !== id);
                yield post.save();
            }
        }
        const data = yield comment_model_1.default.findByIdAndDelete(id);
        if (data) {
            res.status(200).send("item deleted");
            return;
        }
        else {
            res.status(404).send("item not found");
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
        return;
    }
});
exports.default = {
    createComment,
    getAllCommentsByPost,
    getCommentById,
    updateComment,
    deleteComment,
};
//# sourceMappingURL=comment_controller.js.map