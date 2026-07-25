# 🗺️ Personal Task Manager: Project Blueprint & Setup Guide

Save this document as `BACKUP_GUIDE.md` in your project folder. This contains your full setup history, configurations, data models, and your complete 1-2 week roadmap for the staff review.

---

## 🚀 The Tech Stack & Architecture
- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS (v3 stable pipeline)
- **Database Engine:** Prisma ORM
- **Testing:** Vitest / Jest (Requirement: 5 test cases)

---

## 🛠️ Phase 1: Environment & Tooling Setup (Completed)

### 1.1 Core Configuration Files

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### `src/App.jsx` (Tailwind Verification Component)
```jsx
function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-600 underline">
        Tailwind is working!
      </h1>
    </div>
  )
}
export default App;
```

### 1.2 Database Initialization & Data Schema

#### `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Task {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  dueDate     DateTime
  isCompleted Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

---

## 📋 Comprehensive 1-2 Week Project Roadmap

### Phase 1: Local Development Architecture
- [x] **1.1:** Complete base folder structure and environment configuration
- [x] **1.2:** Install and configure Tailwind CSS 
- [x] **1.3:** Initialize Prisma and connect your database provider
- [x] **1.4:** Define the `Task` database schema and execute the first migration

### Phase 2: Core Frontend UI Components (Current Phase)
- [x] **2.1:** Design Dashboard Layout & App Navigation
- [x] **2.2:** Build the Task List grid/table view (rendered with clean mock data)
- [x] **2.3:** Build the Task Creation & Editing form modal/component

### Phase 3: Backend API Setup (Full-Stack Connection)
- [ ] **3.1:** Create local API route handlers for Tasks (CRUD: Create, Read, Update, Delete)
- [ ] **3.2:** Connect Frontend components to read live tasks from the database (GET)
- [ ] **3.3:** Connect Frontend forms to save, update, and delete tasks dynamically

### Phase 4: Advanced Sorting & Filtering
- [ ] **4.1:** Implement frontend filtering by category/status (e.g., Todo, In Progress, Completed)
- [ ] **4.2:** Implement sorting logic by upcoming due dates

### Phase 5: Testing (Staff Requirement)
- [ ] **5.1:** Install and configure Vitest and React Testing Library
- [ ] **5.2:** Write 5 comprehensive unit/integration test cases proving app stability

---

## 🔒 Security Warning (Prisma `.env`)
Confirm your `.gitignore` file in your root folder always includes these lines to prevent committing database keys or private passwords to GitHub:
```text
node_modules/
.env
.env.*
dist/
```

---

## 🏎️ Git Recovery Commands
If your branch ever gets out of sync or you need to re-upload to GitHub:
```bash
git add .
git commit -m "feat: complete step checkpoint"
git branch -M main
git remote add origin https://github.com
git push -u origin main
```
