import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import databaseConnections from "./database/db";
import UserModel from "./models/usermodel";
import contentModel from "./models/content_model";
import { authMiddleware } from "./middleware/authMiddleware";
const app = express();

databaseConnections();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("hey there");
});

const userObject = z.object({
    username: z.string().min(3).max(30),
    password: z
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
app.post("/signup", async (req, res) => {
    try {
        const result = userObject.safeParse(req.body);

        if (result.success) {
            const newUser = new UserModel(req.body);
            await newUser.save();
            res.status(200).json({
                message: "you are succesfully signed in"
            });


            return;
        }
        else {
            console.log(result.error);

            return;
        }

    } catch (error) {
        console.log(error);
        return;

    }
});

// sign in endpoint
app.post("/signin", async (req, res) => {
    const uesrResult = userObject.safeParse(req.body);

    if (uesrResult.success) {
        const existingUser = await UserModel.findOne({ username: req.body.username });

        if (existingUser && existingUser.password === req.body.password) {
            const token = jwt.sign({ userId: existingUser._id }, "ANSH");
            console.log(token);

            res.status(200).json({
                token: token,
            })
            return;
        }
        else {
            res.status(401).json({
                message: "Inavlid credntails"
            })
            return;
        }
    }
    else {
        res.status(401).json({
            message: "Please signin first"
        })
        return;
    }

})

app.use(authMiddleware);

// add the new content
app.post("/add-new-content", async (req, res) => {
    try {
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        const tags = req.body.tags;
        // @ts-ignore
        const userId = req.userId

        const newContent = new contentModel(
            {
                link,
                type,
                title,
                tags,
                userId
            }
        );

        await newContent.save();
        res.status(200).json({
            "message": "content succesfuly saved"
        })

        return;

    } catch (error) {
        res.status(401).json({
            error
        })
        return;
    }

})

// fetch all the document
app.get("/get-content", async (req, res) => {
    try {
        // @ts-ignore
        const content = await contentModel.find({ userId: req.userId }).populate("userId", "username");
        res.status(200).json({
            content
        })
        return;
    } catch (error) {
        res.status(401).json({
            error
        })
        return;
    }
})

// delete a conent with the given id
app.delete("/delete-content", async (req, res) => {
    try {
        // @ts-ignore
        const delete_content = await contentModel.findOneAndDelete({ userId: req.userId })
        res.status(200).json({
            "message": "content deleted succesfully",
            delete_content
        })
        return;
    } catch (error) {
        res.status(401).json({
            error
        })
        return;
    }
})

// create a sharable link
app.post("/share-link", async (req, res) => {
    try {
        // @ts-ignore
        const username = await UserModel.findOne({ _id: req.userId })

        res.status(200).json({
            link: username
        })

    } catch (error) {
        res.status(401).json({
            error
        })
    }
})

app.get("/brain/:sharelink", async (req, res) => {
    try {
        const username = req.body.username
        //@ts-ignore
        const userData = await contentModel.find({ userId: req.userId })
        res.status(200).json({
            username: username,
            userData
        })

    } catch (error) {
        res.status(401).json({
            error
        })
    }

})


app.listen(3000, () => {
    console.log("server is listening on the port 3000");
});
