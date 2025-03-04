"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_model_1 = __importDefault(require("../models/comments_model"));
const base_controllers_1 = __importDefault(require("./base_controllers"));
const commentsControllers = (0, base_controllers_1.default)(comments_model_1.default);
exports.default = commentsControllers;
//# sourceMappingURL=comments_controller.js.map