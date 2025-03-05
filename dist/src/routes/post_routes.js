"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    post_controller_1.default.getAll(req, res);
});
router.get("/:id", (req, res) => {
    post_controller_1.default.getById(req, res);
});
router.post("/", auth_controller_1.authMiddleware, (req, res) => {
    post_controller_1.default.createItem(req, res);
});
router.delete("/:id", auth_controller_1.authMiddleware, (req, res) => {
    post_controller_1.default.deleteItem(req, res);
});
exports.default = router;
//# sourceMappingURL=post_routes.js.map