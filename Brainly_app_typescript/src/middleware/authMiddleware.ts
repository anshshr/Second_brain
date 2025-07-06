import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["token"];

    const decoded = jwt.verify(token as string, "ANSH")

    if (decoded) {
        // @ts-ignore
        req.userId = decoded.userId
        next()
    }
    else {
        res.status(401).json({
            "message": "Please log in first"
        })
    }
}

