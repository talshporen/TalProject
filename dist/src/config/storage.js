"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const mime_types_1 = __importDefault(require("mime-types"));
const fs_1 = __importDefault(require("fs"));
if (!fs_1.default.existsSync("uploads")) {
    fs_1.default.mkdirSync("uploads");
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${(0, uuid_1.v4)()}.${mime_types_1.default.extension(file.mimetype) || "bin"}`;
        cb(null, uniqueFilename);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        req.fileValidationError = "Only image files are allowed!";
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
});
exports.default = upload;
//# sourceMappingURL=storage.js.map