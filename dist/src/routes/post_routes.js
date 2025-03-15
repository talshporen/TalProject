"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = require("../middleware/auth_middleware");
const storage_1 = __importDefault(require("../config/storage"));
const router = express_1.default.Router();
router.get("/", post_controller_1.default.getAllPosts);
router.get("/feed", post_controller_1.default.getFeedPosts);
router.get("/:postId", post_controller_1.default.getPostById);
router.post("/", auth_middleware_1.authUser, storage_1.default.single('picture'), post_controller_1.default.createPost);
router.post("/:postId/like", auth_middleware_1.authUser, post_controller_1.default.likePost);
router.put("/:postId", auth_middleware_1.authUser, storage_1.default.single('picture'), post_controller_1.default.updatePost);
router.delete("/:postId", auth_middleware_1.authUser, post_controller_1.default.deletePost);
exports.default = router;
//# sourceMappingURL=post_routes.js.map