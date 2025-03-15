"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const post_routes_1 = __importDefault(require("./routes/post_routes"));
const comment_routes_1 = __importDefault(require("./routes/comment_routes"));
const user_routes_1 = __importDefault(require("./routes/user_routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = __importDefault(require("./doc/swagger"));
require("./types/types");
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "*");
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
app.use("/uploads", express_1.default.static("uploads"));
app.use("/user", user_routes_1.default);
app.use('/post', post_routes_1.default);
app.use('/comment', comment_routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
});
// Swagger docs
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../../wardrobe-share-web-client/Client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../../wardrobe-share-web-client/Client/dist', 'index.html'));
    });
}
const initApp = () => {
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", function () {
            console.log("Connected to the database");
        });
        if (!process.env.DB_CONNECT) {
            reject("DB_CONNECT is not defined");
        }
        else {
            mongoose_1.default
                .connect(process.env.DB_CONNECT)
                .then(() => {
                resolve(app);
            })
                .catch((err) => {
                reject(err);
            });
        }
    });
};
exports.default = initApp;
//# sourceMappingURL=server.js.map