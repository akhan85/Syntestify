# 🏗️ AI-Powered SQA Platform – Full Architecture (Next.js + Supabase)

## 🗂️ File & Folder Structure

```
/sqa-ai-platform
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout wrapper
│   ├── page.tsx                # Landing page
│   ├── dashboard/              # Authenticated user area
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard main view
│   │   ├── project/[id]/       # Project detail + test case generation
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   └── components/         # Shared dashboard components
│   └── auth/                   # Auth routes (login, signup)
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/                 # Reusable UI components (buttons, modals)
├── lib/                        # Utility functions and Supabase client
│   ├── supabase.ts             # Supabase client + helpers
│   └── ai.ts                   # AI generation service (OpenAI or custom API)
├── services/                   # Business logic + abstraction
│   ├── testCaseService.ts      # Handles test case generation logic
│   └── projectService.ts       # CRUD for projects/software descriptions
├── hooks/                      # React hooks (e.g., useUser, useProject)
├── types/                      # TypeScript types/interfaces
│   └── index.ts
├── middleware.ts               # Middleware for auth protection
├── .env.local                  # Environment variables
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── package.json
└── README.md
```

## 🧠 Core Concepts

### 🌐 Frontend (Next.js – App Router)
Uses `app/` directory for nested layouts and route segments. Auth handled by Supabase Auth. UI components include `TextArea`, `ProjectCard`, etc.

## 🗄️ Backend & State Management

### 🔐 Supabase (DB + Auth)
Handles auth, session persistence, and stores:
- `projects`: Software descriptions
- `requirements`: User/business requirements
- `test_cases`: AI-generated cases

### 📥 Supabase Schema Overview
```sql
-- projects
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
title TEXT
description TEXT

-- requirements
id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
text TEXT

-- test_cases
id UUID PRIMARY KEY
requirement_id UUID REFERENCES requirements(id)
type TEXT CHECK (type IN (...))
content TEXT
```

## 🧬 Services

### `testCaseService.ts`
Generates test cases from requirements using AI, stores in DB.

### `projectService.ts`
Handles project/requirement CRUD.

### `lib/ai.ts`
AI interface layer (OpenAI or self-hosted model).

## 💾 State Management

| State         | Storage                      | Tech Used           |
|---------------|-------------------------------|---------------------|
| Auth          | Supabase session              | Supabase helpers    |
| UI State      | Local / Zustand (optional)    | useState / Zustand  |
| Project Data  | Supabase + SWR caching        | useSWR / useQuery   |

## 🔌 AI Integration

POST `/api/ai/generate-test-cases`
```json
{
  "description": "...",
  "requirements": ["..."]
}
```

Returns:
```json
[
  {
    "type": "functional",
    "content": "Test if user can log in..."
  }
]
```

## 🧪 Supported Test Case Types

- Functional
- Integration
- UI/UX
- Performance
- Security
- UAT
- Usability

## 🔐 Auth & Security

- Supabase email/password auth
- RLS ensures user-specific data access
- Middleware protects routes

## 🌟 Optional Features

| Feature                | Stack                    |
|------------------------|--------------------------|
| Versioning             | Supabase history table   |
| Role-based access      | Supabase roles + RLS     |
| Prompt customization   | Editable base prompts    |
| Export to PDF/CSV      | react-csv / jsPDF        |
| Feedback on output     | Rating mechanism         |
| Chat-like UI           | Threaded generation      |

## 🧰 Tech Stack Summary

| Layer      | Tech             |
|------------|------------------|
| Frontend   | Next.js 14       |
| Styling    | Tailwind CSS     |
| Backend    | Supabase         |
| AI         | OpenAI or local  |
| DB         | Supabase PG      |
| State      | React Hooks/SWR  |
| Hosting    | Vercel / Supabase|

### CODING PROTOCOL ###
" Coding Instructions- Write the absolute minimum code required
- No sweeping changes
- No unrelated edits - focus on just the task you're on
- Make code precise, modular, testable
- Don’t break existing functionality
- If I need to do anything (e.g. Supabase config), tell me clearly 