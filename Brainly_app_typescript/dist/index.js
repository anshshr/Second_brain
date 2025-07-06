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
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./database/db"));
const usermodel_1 = __importDefault(require("./models/usermodel"));
const content_model_1 = __importDefault(require("./models/content_model"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("hey there");
});
const userObject = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30),
    password: zod_1.z
        .string()
        .regex(/[A-Z]/, {
        message: "password must contain at least one uppercase letter",
    })
        .regex(/[a-z]/, {
        message: "password must contain at least one lowercase letter",
    })
        .regex(/[0-9]/, {
        message: "password must contain at least one number",
    }),
});
// sign up a user
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = userObject.safeParse(req.body);
        if (result.success) {
            const newUser = new usermodel_1.default(req.body);
            yield newUser.save();
            res.status(200).json({
                message: "you are succesfully signed in"
            });
            return;
        }
        else {
            console.log(result.error);
            return;
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
}));
// sign in endpoint
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uesrResult = userObject.safeParse(req.body);
    if (uesrResult.success) {
        const existingUser = yield usermodel_1.default.findOne({ username: req.body.username });
        if (existingUser && existingUser.password === req.body.password) {
            const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, "ANSH");
            console.log(token);
            res.status(200).json({
                token: token,
            });
            return;
        }
        else {
            res.status(401).json({
                message: "Inavlid credntails"
            });
            return;
        }
    }
    else {
        res.status(401).json({
            message: "Please signin first"
        });
        return;
    }
}));
app.use(authMiddleware_1.authMiddleware);
// add the new content
app.post("/add-new-content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        const tags = req.body.tags;
        // @ts-ignore
        const userId = req.userId;
        const newContent = new content_model_1.default({
            link,
            type,
            title,
            tags,
            userId
        });
        yield newContent.save();
        res.status(200).json({
            "message": "content succesfuly saved"
        });
        return;
    }
    catch (error) {
        res.status(401).json({
            error
        });
        return;
    }
}));
// fetch all the document
app.get("/get-content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const content = yield content_model_1.default.find({ userId: req.userId }).populate("userId", "username");
        res.status(200).json({
            content
        });
        return;
    }
    catch (error) {
        res.status(401).json({
            error
        });
        return;
    }
}));
// delete a conent with the given id
app.delete("/delete-content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const delete_content = yield content_model_1.default.findOneAndDelete({ userId: req.userId });
        res.status(200).json({
            "message": "content deleted succesfully",
            delete_content
        });
        return;
    }
    catch (error) {
        res.status(401).json({
            error
        });
        return;
    }
}));
// create a sharable link
app.get("/share-link", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userContent = yield content_model_1.default.find({ userId: req.userId });
        res.status(200).json({
            "User Content": userContent,
        });
    }
    catch (error) {
        res.status(401).json({
            error
        });
    }
}));
app.listen(3000, () => {
    console.log("server is listening on the port 3000");
});
