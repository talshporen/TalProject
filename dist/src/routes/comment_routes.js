"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const auth_middleware_1 = require("../middleware/auth_middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authUser, comment_controller_1.default.createComment);
router.get("/post/:postId", comment_controller_1.default.getAllCommentsByPost);
router.get("/:commentId", comment_controller_1.default.getCommentById);
router.put("/:commentId", auth_middleware_1.authUser, comment_controller_1.default.updateComment);
router.delete("/:commentId", auth_middleware_1.authUser, comment_controller_1.default.deleteComment);
exports.default = router;
//# sourceMappingURL=comment_routes.js.map