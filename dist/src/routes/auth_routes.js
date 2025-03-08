"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *  name: Auth
 * description: The Authentication API
 */
/**
* @swagger
* components:
*   securitySchemes:
*       bearerAuth:
*        type: http
*        scheme: bearer
*        bearerFormat: JWT
*/
/**
* @swagger
* components:
*   schemas:
*       User:
*         type: object
*         required:
*           - email
*           - password
*         properties:
*           email:
*             type: string
*             description: The user email
*           password:
*             type: string
*             description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/
/**
* @swagger
* /auth/register:
*   post:
*       summary: registers a new user
*       tags: [Auth]
*       requestBody:
*        required: true
*       content:
*         application/json:
*           schema:
*            $ref: '#/components/schemas/User'
*        responses:
*         200:
*            description: Registration success, retuet the new user
*            content:
*              application/json:
*                schema:
*                   $ref: '#/components/schemas/User'
*/
router.post('/register', auth_controller_1.default.register);
/**
* @swagger
* /auth/login:
*   post:
*     summary: authenticate a user and return access and refresh tokens.
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*      responses:
*        200:
*          description: successful login
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*/
router.post('/login', auth_controller_1.default.login);
router.post('/logout', auth_controller_1.default.logout);
router.post('/refresh', auth_controller_1.default.refresh);
exports.default = router;
//# sourceMappingURL=auth_routes.js.map