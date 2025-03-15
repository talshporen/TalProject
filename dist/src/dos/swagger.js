"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_paths_1 = __importDefault(require("./user_routes_paths"));
const post_routes_paths_1 = __importDefault(require("./post_routes_paths"));
const comment_routes_paths_1 = __importDefault(require("./comment_routes_paths"));
const components_1 = __importDefault(require("./components"));
const options = {
    openapi: "3.1.0",
    info: {
        title: "Express API with Swagger, Jest, TypeScript and JWT",
        version: "0.1.0",
        description: "This is a simple CRUD API application made with Express in TypeScript documented with Swagger, tested with Jest and protected with JWT.",
        license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
        },
    },
    servers: [
        {
            url: "https://137.cs.colman.ac.il",
            description: "Production server",
        },
        {
            url: "http://localhost:3000",
            description: "Local development server",
        },
    ],
    tags: [
        {
            name: "Users",
            description: "Operations about user",
        },
        {
            name: "Posts",
            description: "Operations about posts",
        },
        {
            name: "Comments",
            description: "Operations about comments",
        },
    ],
    paths: Object.assign(Object.assign(Object.assign({}, user_routes_paths_1.default), post_routes_paths_1.default), comment_routes_paths_1.default),
    components: components_1.default,
};
exports.default = options;
//# sourceMappingURL=swagger.js.map