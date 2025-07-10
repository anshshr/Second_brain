"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Auth header:", authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("No auth header or invalid format");
            res.status(401).json({
                message: "No token provided or invalid format"
            });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log("Token:", token.substring(0, 20) + "...");
        const decoded = jsonwebtoken_1.default.verify(token, "ANSH");
        console.log("Decoded:", decoded);
        if (decoded) {
            req.userId = decoded.userId;
            console.log("Auth successful for user:", decoded.userId);
            next();
        }
        else {
            console.log("Token verification failed");
            res.status(401).json({
                message: "Invalid token"
            });
        }
    }
    catch (error) {
        console.log("Auth error:", error);
        res.status(401).json({
            message: "Invalid token"
        });
    }
};
exports.authMiddleware = authMiddleware;
