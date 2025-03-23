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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const comment_model_1 = __importDefault(require("../models/comment_model"));
const mongoose_1 = require("mongoose");
const functions_1 = require("../utils/functions");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.query.userId;
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const phone = req.body.phone;
    const region = req.body.region;
    const city = req.body.city;
    const picture = req.file ? req.file.path : null;
    if (!title || !description || !category || !phone || !region || !city) {
        res.status(400).send("Missing required fields");
        yield (0, functions_1.deleteFileFromPath)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        return;
    }
    const post = yield post_model_1.default.create({
        user: id,
        title,
        description,
        category,
        phone,
        region,
        city,
        picture,
        likes: [],
        comments: [],
    });
    res.status(200).send(post);
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.query, { page = 1, limit = 20 } = _a, filters = __rest(_a, ["page", "limit"]);
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const data = yield post_model_1.default.find(filters).skip(skip).limit(limitNumber);
    const total = yield post_model_1.default.countDocuments(filters);
    if (data.length === 0) {
        res.status(404).send("No data found");
        return;
    }
    res.status(200).send({
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        data,
    });
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.postId;
    try {
        const data = yield post_model_1.default.findById(id);
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
const getFeedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield post_model_1.default.distinct("category");
    const postsByCategory = {};
    for (const category of categories) {
        const posts = yield post_model_1.default
            .find({ category })
            .limit(4)
            .sort({ createdAt: -1 });
        postsByCategory[category] = posts;
    }
    res.status(200).send(postsByCategory);
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const postId = req.params.postId;
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const phone = req.body.phone;
    const region = req.body.region;
    const city = req.body.city;
    const likes = req.body.likes;
    const comments = req.body.comments;
    if (likes || comments) {
        res.status(403).send("Cannot update likes or comments");
        yield (0, functions_1.deleteFileFromPath)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        return;
    }
    const post = yield post_model_1.default.findOne({ _id: postId });
    if (!post) {
        res.status(400).send("post not found");
        yield (0, functions_1.deleteFileFromPath)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        return;
    }
    let picture = post.picture;
    if (req.file) {
        yield (0, functions_1.deleteFileFromPath)(post.picture);
        picture = req.file.path;
        post.picture = picture;
    }
    if (title)
        post.title = title;
    if (description)
        post.description = description;
    if (category)
        post.category = category;
    if (phone)
        post.phone = phone;
    if (region)
        post.region = region;
    if (city)
        post.city = city;
    yield post.save();
    res.status(200).send(post);
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.postId;
    try {
        const data = yield post_model_1.default.findById(id);
        const user = yield user_model_1.default.findById(data === null || data === void 0 ? void 0 : data.user);
        user === null || user === void 0 ? void 0 : user.likedPosts.forEach((post) => __awaiter(void 0, void 0, void 0, function* () {
            if (post.toString() === id) {
                user.likedPosts = user.likedPosts.filter((post) => post.toString() !== id);
            }
        }));
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield (0, functions_1.deleteFileFromPath)(data === null || data === void 0 ? void 0 : data.picture);
        yield comment_model_1.default.deleteMany({ post: id });
        yield post_model_1.default.findByIdAndDelete(id);
        res.send("item deleted");
        return;
    }
    catch (err) {
        res.status(400).send(err);
        return;
    }
});
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.query.userId;
    let flag = false;
    const post = yield post_model_1.default.findById(postId);
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        res.status(403).send("User not found");
        return;
    }
    if (!post) {
        res.status(404).send("Post not found");
        return;
    }
    const u_id = new mongoose_1.Types.ObjectId(userId);
    const p_id = new mongoose_1.Types.ObjectId(postId);
    if (post.likes.includes(u_id)) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
        user.likedPosts = user.likedPosts.filter((id) => id.toString() !== postId);
        flag = true;
    }
    else {
        post.likes.push(u_id);
        user.likedPosts.push(p_id);
    }
    yield post.save();
    yield user.save();
    if (flag) {
        res.send("Post unliked");
        return;
    }
    else {
        res.send("Post liked");
        return;
    }
});
exports.default = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    getFeedPosts,
};
//# sourceMappingURL=post_controller.js.map