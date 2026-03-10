# Second Brain

A full-stack personal knowledge management app where users can save links (articles, videos, audio, images), organize them with tags, and query their own saved library using an AI assistant.

## What Problem This Solves

Normally saved links get scattered across browser bookmarks, chats, and notes. This project provides one place to:

- save all learning/content links
- categorize by content type
- tag for faster filtering
- retrieve content quickly from dashboard
- ask natural-language questions to AI over your own saved data

## Key Features

- User authentication with JWT (`/signup`, `/signin`)
- Protected APIs using auth middleware
- Add content with title, link, type, and tags
- Fetch all content for logged-in user
- Filter content by type (`image`, `audio`, `video`, `article`)
- Delete content item by ID
- AI query endpoint that:
- reads user's saved library
- builds context from title/type/tags/link
- sends query to Groq LLM (`llama3-8b-8192`)
- returns answer + top related links
- Frontend with route protection and auth state persistence
- Dashboard UI for category-based browsing
- Chat-style AI assistant screen with related content suggestions
- Docker support for backend and frontend

## Architecture Overview

- `Second-brain-fe` (React + TypeScript + Vite + Tailwind): UI and user interactions
- `Brainly_app_typescript` (Node.js + Express + TypeScript + MongoDB): API and data layer
- MongoDB Atlas: persistent storage for users and saved content
- Groq API: LLM response generation on personal knowledge base context

## End-to-End Flow

1. User signs up or signs in from frontend.
2. Backend validates input (`zod`) and returns JWT token.
3. Frontend stores token in `localStorage` and unlocks protected routes.
4. User adds links from dashboard via modal form.
5. Backend stores content with `userId` reference in MongoDB.
6. Dashboard fetches all content or by selected type.
7. User opens AI Assistant and asks a query.
8. Backend loads user's saved content, finds relevant links, sends context to LLM.
9. Backend returns AI response + related links.
10. Frontend displays chat response with suggested saved links.

## Folder Structure

```text
Second_brain/
  README.md
  Second_brain.md
  Brainly_app_typescript/
    src/
      index.ts
      database/db.ts
      middleware/authMiddleware.ts
      models/
        usermodel.ts
        content_model.ts
        tag_model.ts
    dockerfile
    package.json
  Second-brain-fe/
    src/
      App.tsx
      contexts/AuthContext.tsx
      pages/Dashboard.tsx
      pages/QueryLLM.tsx
      components/
        SignIn.tsx
        SignUp.tsx
        AddContentModal.tsx
        ContentGrid.tsx
        NoteCard.tsx
    Dockerfile
    package.json
```

## Backend API Summary

### Public

- `POST /signup` -> create account with username/password validation
- `POST /signin` -> returns JWT token

### Protected (Bearer Token Required)

- `POST /add-new-content` -> add new content
- `GET /get-content` -> get all user content
- `GET /get-content-by-type/:type` -> filter user content by type
- `DELETE /delete-content/:id` -> delete one item
- `POST /query-llm` -> AI response using user library context
- `POST /share-link` -> returns user reference (basic implementation)
- `GET /brain/:sharelink` -> placeholder sharing endpoint

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- Zod
- JWT
- Groq SDK

## Local Setup

## Prerequisites

- Node.js 18+ (project Docker uses Node 22)
- npm
- MongoDB connection string
- Groq API key

## 1. Clone and Install

```bash
# from workspace root
cd Second_brain

# backend
cd Brainly_app_typescript
npm install

# frontend
cd ..\Second-brain-fe
npm install
```

## 2. Run Backend

```bash
cd Brainly_app_typescript
npm run build
npm start
```

Backend runs at `http://localhost:3000`.

## 3. Run Frontend

```bash
cd Second-brain-fe
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Docker Run

### Backend

```bash
cd Brainly_app_typescript
docker build -t second-brain-backend -f dockerfile .
docker run -p 3000:3000 second-brain-backend
```

### Frontend

```bash
cd Second-brain-fe
docker build -t second-brain-frontend .
docker run -p 5173:5173 second-brain-frontend
```

## Solution Approach

This solution uses a practical hybrid approach:

- Structured storage (MongoDB) for reliable retrieval
- Simple tagging and content typing for filtering and relevance
- Authentication boundaries to keep each user's data isolated
- Context-enriched LLM prompting so AI answers come from user-owned data
- Fast React UI for real-time browsing and querying

This design makes the app useful both as a normal bookmark manager and as an AI-assisted knowledge interface.

## Current Gaps and Recommended Improvements

- Move hardcoded secrets (JWT secret, DB URI, Groq key) to `.env`
- Hash passwords before storing
- Add pagination and search endpoint
- Improve sharing flow (`/share-link`, `/brain/:sharelink`)
- Add unit/integration tests
- Add content edit/update endpoint
- Add better error logging and monitoring

## Demo Queries for AI Assistant

- `What videos do I have about React?`
- `Show me all content related to machine learning`
- `Which articles are tagged with javascript?`
- `Find audio resources from my saved content`

## License

ISC
