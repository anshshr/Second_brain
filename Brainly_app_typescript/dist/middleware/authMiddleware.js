"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers["token"];
    const decoded = jsonwebtoken_1.default.verify(token, "ANSH");
    if (decoded) {
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    }
    else {
        res.status(401).json({
            "message": "Please log in first"
        });
    }
};
exports.authMiddleware = authMiddleware;
