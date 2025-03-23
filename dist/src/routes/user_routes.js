"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = __importDefault(require("../controllers/user_controllers"));
const auth_middleware_1 = require("../middleware/auth_middleware");
const storage_1 = __importDefault(require("../config/storage"));
const router = express_1.default.Router();
router.post("/register", storage_1.default.single('picture'), user_controllers_1.default.register);
router.post("/googleLogin", user_controllers_1.default.googleLogin);
router.post("/login", user_controllers_1.default.login);
router.post("/logout", user_controllers_1.default.logout);
router.post("/refresh", user_controllers_1.default.refresh);
router.get("/:userId", user_controllers_1.default.getUser);
router.get("/auth/settings", auth_middleware_1.authUser, user_controllers_1.default.getSettings);
router.put("/update", auth_middleware_1.authUser, storage_1.default.single('picture'), user_controllers_1.default.updateUser);
router.delete("/delete", auth_middleware_1.authUser, user_controllers_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user_routes.js.map