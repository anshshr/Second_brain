import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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

        const decoded = jwt.verify(token, "ANSH") as { userId: string };
        console.log("Decoded:", decoded);

        if (decoded) {
            req.userId = decoded.userId;
            console.log("Auth successful for user:", decoded.userId);
            next();
        } else {
            console.log("Token verification failed");
            res.status(401).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        console.log("Auth error:", error);
        res.status(401).json({
            message: "Invalid token"
        });
    }
}

