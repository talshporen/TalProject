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
exports.deleteFileFromPath = exports.isValidURL = void 0;
const fs_1 = __importDefault(require("fs"));
const isValidURL = (string) => {
    try {
        new URL(string);
        return true;
    }
    catch (_) {
        return false;
    }
};
exports.isValidURL = isValidURL;
const deleteFileFromPath = (path) => __awaiter(void 0, void 0, void 0, function* () {
    if (!path || (0, exports.isValidURL)(path)) {
        return true;
    }
    return new Promise((resolve, reject) => {
        fs_1.default.unlink(path, (err) => {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        });
    });
});
exports.deleteFileFromPath = deleteFileFromPath;
//# sourceMappingURL=functions.js.map