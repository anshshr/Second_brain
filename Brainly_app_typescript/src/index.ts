import express from "express";
import cors from "cors";
import { z } from "zod";
import jwt from "jsonwebtoken";
import Groq from "groq-sdk";
import databaseConnections from "./database/db";
import UserModel from "./models/usermodel";
import contentModel from "./models/content_model";
import { authMiddleware } from "./middleware/authMiddleware";

// Initialize Groq client with hardcoded API key
const groq = new Groq({
    apiKey: "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"
});

const app = express();

databaseConnections();
app.use(cors()); // Enable CORS for all routes
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
            // Check if user already exists
            const existingUser = await UserModel.findOne({ username: req.body.username });
            if (existingUser) {
                res.status(400).json({
                    message: "User already exists with this username"
                });
                return;
            }

            const newUser = new UserModel(req.body);
            await newUser.save();
            res.status(200).json({
                message: "User successfully created"
            });
            return;
        }
        else {
            res.status(400).json({
                message: "Validation failed",
                errors: result.error.errors.map(err => err.message)
            });
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
});

// sign in endpoint
app.post("/signin", async (req, res) => {
    try {
        const userResult = userObject.safeParse(req.body);

        if (userResult.success) {
            const existingUser = await UserModel.findOne({ username: req.body.username });

            if (existingUser && existingUser.password === req.body.password) {
                const token = jwt.sign({ userId: existingUser._id }, "ANSH");
                console.log("User signed in:", req.body.username);

                res.status(200).json({
                    token: token,
                    message: "Successfully signed in"
                })
                return;
            }
            else {
                res.status(401).json({
                    message: "Invalid username or password"
                })
                return;
            }
        }
        else {
            res.status(400).json({
                message: "Validation failed",
                errors: userResult.error.errors.map(err => err.message)
            })
            return;
        }
    } catch (error) {
        console.log("Signin error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
})

app.use(authMiddleware);

// add the new content
app.post("/add-new-content", async (req, res): Promise<void> => {
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

    } catch (error) {
        res.status(401).json({
            error
        })
    }

})

// fetch all the document
app.get("/get-content", async (req, res): Promise<void> => {
    try {
        // @ts-ignore
        const content = await contentModel.find({ userId: req.userId }).populate("userId", "username");
        res.status(200).json({
            content
        })
    } catch (error) {
        res.status(401).json({
            error
        })
    }
})

// fetch content by type
app.get("/get-content-by-type/:type", async (req, res): Promise<void> => {
    try {
        const { type } = req.params;
        // @ts-ignore
        const content = await contentModel.find({
            userId: req.userId,
            type: type
        }).populate("userId", "username");

        res.status(200).json({
            content
        })
    } catch (error) {
        res.status(401).json({
            error
        })
    }
})

// delete a content with the given id
app.delete("/delete-content/:id", authMiddleware, async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const delete_content = await contentModel.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!delete_content) {
            res.status(404).json({
                message: "Content not found"
            });
            return;
        }

        res.status(200).json({
            message: "Content deleted successfully",
            delete_content
        });
    } catch (error) {
        res.status(401).json({
            error
        });
    }
});

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

// LLM Query endpoint
app.post("/query-llm", authMiddleware, async (req, res): Promise<void> => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== 'string') {
            res.status(400).json({
                message: "Query is required"
            });
            return;
        }

        // @ts-ignore
        const userId = req.userId;

        // Get all user's content to search through
        const userContent = await contentModel.find({ userId }).select('title link type tags');

        // Create a context string from user's content for the LLM
        const contentContext = userContent.map(content =>
            `Title: ${content.title}, Type: ${content.type}, Tags: ${content.tags.join(', ')}, Link: ${content.link}`
        ).join('\n');

        // Find relevant links based on query and tags
        const queryLower = query.toLowerCase();
        const relatedLinks = userContent.filter(content => {
            const titleMatch = content.title.toLowerCase().includes(queryLower);
            const tagMatch = content.tags.some(tag =>
                tag.toLowerCase().includes(queryLower) ||
                queryLower.includes(tag.toLowerCase())
            );
            const typeMatch = content.type.toLowerCase().includes(queryLower);

            return titleMatch || tagMatch || typeMatch;
        }).slice(0, 5); // Limit to 5 most relevant links

        // Create the prompt for the LLM
        const systemPrompt = `You are an AI assistant helping a user query their personal knowledge base. The user has saved various links with titles, types, and tags. 

User's Content Library:
${contentContext}

Please answer the user's question based on their saved content. If you find relevant content from their library, mention it in your response. Be helpful, concise, and reference specific items from their collection when relevant.

If the query is about a specific topic and they have related content, suggest they check out those links. Always be encouraging about their knowledge collection.`;

        // Call the LLM
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            model: "llama3-8b-8192",
            temperature: 0.7,
            max_tokens: 1000
        });

        const llmResponse = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        res.status(200).json({
            response: llmResponse,
            relatedLinks: relatedLinks,
            totalContent: userContent.length
        });

    } catch (error) {
        console.error("LLM Query error:", error);
        res.status(500).json({
            message: "Failed to process query",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

app.listen(3000, () => {
    console.log("server is listening on the port 3000");
});
