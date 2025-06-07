# 🏁 MVP Build Plan for AI-Powered SQA Platform

This step-by-step plan follows the compact architecture using **Next.js (App Router)** and **Supabase**. Each task is granular, testable, and focused.

## ✅ Phase 1: Environment Setup

### 1. Initialize Next.js Project
- Start: Open terminal  
- End: Project scaffolded with `app/` router  
- Command: `npx create-next-app@latest syntestify --app`

### 2. Set Up Supabase Project
- Start: Log into Supabase  
- End: Supabase project created with credentials

### 3. Connect Supabase to Next.js
- Start: Install SDK and add `.env.local`  
- End: `lib/supabase.ts` with working client

## 🔐 Phase 2: Authentication

### 4. Implement Sign Up Page
- Start: Create `/app/auth/signup/page.tsx`  
- End: User can sign up via Supabase email/password

### 5. Implement Login Page
- Start: Create `/app/auth/login/page.tsx`  
- End: User can log in and session is persisted

### 6. Middleware for Auth Protection
- Start: Create `middleware.ts`  
- End: Redirect unauthenticated users from `/dashboard`

## 📄 Phase 3: Project + Requirement Input

### 7. Create Project Table in Supabase
- Start: Write SQL or use UI  
- End: `projects` table exists

### 8. Create New Project UI
- Start: Build form in `/dashboard/page.tsx`  
- End: User can input title and description

### 9. Submit Project to Supabase
- Start: Hook up form with API call  
- End: Project inserted into Supabase

### 10. Create Requirements Table
- Start: Add `requirements` table to DB  
- End: Linked to `project_id`, stores text

### 11. Add UI for Requirements
- Start: Input form for requirements  
- End: Requirements stored for selected project

## ⚙️ Phase 4: AI Test Case Generation

### 12. Create Test Case Table
- Start: Add `test_cases` table in Supabase  
- End: Stores type + content

### 13. Create API Route for Generation
- Start: Create `/api/ai/generate-test-cases.ts`  
- End: Accepts description + requirements JSON

### 14. Implement `lib/ai.ts`
- Start: Add OpenAI API logic  
- End: Returns structured test case response

### 15. Trigger AI Generation from UI
- Start: Add button in project detail page  
- End: Sends description/requirements to backend

### 16. Store Test Cases
- Start: Store test cases in Supabase  
- End: Linked to requirement + type

### 17. Display Generated Test Cases
- Start: Render list in UI  
- End: Types + content shown

## 🔁 Phase 5: Iteration + Updates

### 18. Enable Project Description Edit
- Start: Make description editable  
- End: Updates synced to Supabase

### 19. Enable Requirement Edits
- Start: Allow editing/deleting requirements  
- End: Changes reflected in DB

### 20. Regenerate Tests on Change
- Start: Add re-run logic  
- End: Old tests cleared, new fetched

## 🎨 Phase 6: UI Polish + Roles

### 21. Add Tailwind Styling to UI
- Start: Style dashboard and test list  
- End: Responsive clean interface

### 22. Role-Based Protection (Optional)
- Start: Add Supabase roles + RLS  
- End: Only owners can modify their data

## 📤 Phase 7: Export + Deployment

### 23. Add Export to CSV
- Start: Add export button  
- End: Test cases downloadable

### 24. Deploy to Vercel
- Start: Connect to GitHub + deploy  
- End: Live URL accessible