# 🗺️ Personal Task Manager: Project Blueprint & Setup Guide

Save this document as `BACKUP_GUIDE.md` in your project folder. This contains your full setup history, configurations, data models, and your complete 1-2 week roadmap for the staff review.

---

## 🚀 The Tech Stack & Architecture
- **Frontend Framework:** React (Vite)
- **Styling Pipeline:** Tailwind CSS (v3 stable configuration)
- **Backend API Engine:** Express.js (Running on http://localhost:5000)
- **Database ORM Layer:** Prisma (v7 strict ES Module specifications)
- **Database Engine:** PostgreSQL via `@prisma/adapter-pg`
- **Testing Suite:** Vitest / Jest (Requirement: 5 test cases)

---

## 🛠️ Phase 1 & 3: Environment, Server, & Database Tooling Setup

### 1.1 Package Manifest (`package.json`)
```json
{
  "name": "personaltaskmanager-project3",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "dependencies": {
    "@prisma/adapter-pg": "^7.9.0",
    "@prisma/client": "^7.9.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "pg": "^8.13.1",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "autoprefixer": "^10.5.4",
    "eslint": "^10.6.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "nodemon": "^3.1.14",
    "postcss": "^8.5.20",
    "prisma": "^7.9.0",
    "tailwindcss": "^3.4.19",
    "vite": "^8.1.1"
  },
  "scripts": {
    "dev": "vite",
    "server": "nodemon server.js",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### 1.2 Full-Stack Server Configuration (`server.js`)
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client/index.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create standard PostgreSQL database connection pool
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Initialize the Prisma v7 Driver Adapter wrapper
const adapter = new PrismaPg(pool);

// Inject the adapter directly into your PrismaClient instance
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Base test endpoint to verify the backend is awake
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", message: "Task Manager Backend is active!" });
});

// Live API Database Fetch Route
app.get('/api/tasks', async (req, res) => {
  try {
    const allTasks = await prisma.task.findMany({
      orderBy: {
        dueDate: 'asc'
      }
    });
    res.json(allTasks);
  } catch (error) {
    console.error("❌ Database Fetch Failure:", error);
    res.status(500).json({ error: "Failed to read task objects out of the database." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Full-stack server running cleanly on http://localhost:${PORT}`);
});
```

### 1.3 Prisma v7 Engine Specifications (`prisma/schema.prisma`)
```prisma
generator client {
  provider     = "prisma-client-js"
  output       = "./generated/client"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
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

### 1.4 Global Prisma CLI Director (`prisma.config.js`)
```javascript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### 1.5 Bundler Core Settings (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 1.6 Interface Layout Utilities (`tailwind.config.js`)
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

### 1.7 PostCSS Directives Configuration (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 1.8 Stylesheet Global Canvas Layer (`src/index.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📋 Comprehensive 1-2 Week Project Roadmap

### Phase 1: Local Development Architecture (Completed)
- [x] **1.1:** Complete base folder structure and environment configuration
- [x] **1.2:** Install and configure Tailwind CSS 
- [x] **1.3:** Initialize Prisma and connect your database provider
- [x] **1.4:** Define the `Task` database schema and execute the first migration

### Phase 2: Core Frontend UI Components (Completed)
- [x] **2.1:** Design Dashboard Layout & App Navigation
- [x] **2.2:** Build the Task List grid/table view (rendered with clean mock data)
- [x] **2.3:** Build the Task Creation & Editing form modal/component

### Phase 3: Backend API Setup (Current Phase)
- [x] **3.1:** Create local API route handlers for Tasks (Express.js infrastructure setup)
- [x] **3.2:** Connect Frontend components to read live tasks from the database (GET)
- [ ] **3.3:** Connect Frontend forms to save, update, and delete tasks dynamically

### Phase 4: Advanced Sorting & Filtering (Partially Completed)
- [ ] **4.1:** Implement frontend filtering by category/status (Completed early in Phase 2)
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
/prisma/generated/
```

---

## 🏎️ Git Recovery Commands
```bash
git add .
git commit -m "feat: complete step checkpoint"
git branch -M main
git remote add origin https://github.com
git push -u origin main
```

