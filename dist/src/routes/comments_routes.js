"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_controller_1 = __importDefault(require("../controllers/comments_controller"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    comments_controller_1.default.getAll(req, res);
});
router.get("/:id", (req, res) => {
    comments_controller_1.default.getById(req, res);
});
router.post("/", (req, res) => {
    comments_controller_1.default.createItem(req, res);
});
router.delete("/:id", (req, res) => {
    comments_controller_1.default.deleteItem(req, res);
});
exports.default = router;
//# sourceMappingURL=comments_routes.js.map