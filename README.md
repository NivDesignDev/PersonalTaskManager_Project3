# 📋 Personal Task Manager (Full-Stack CRUD Portfolio)

A resilient full-stack task management workspace engineered with an interactive React frontend user interface dashboard, an Express.js REST API router, and a live cloud PostgreSQL database tables layer.

---

## 🎥 Project Technical Walkthrough Video
👉 **[Click Here to Watch the Live Full-Stack Project Demo Video](PASTE_YOUR_LOOM_LINK_HERE)**

---

## 🚀 The Full-Stack Architecture
- **Frontend Framework:** React (Vite Engine Engine)
- **Interface Styling:** Tailwind CSS 
- **Backend API Routing Engine:** Express.js (Running cleanly on port 5000)
- **Database ORM Integration:** Prisma (v7 Strict ES Modules Configurations)
- **Cloud Database Database Provider:** PostgreSQL via Neon.tech
- **Automated Test Harness Engine:** Vitest + JSDOM Simulated Browsers (5 Passed Test Cases)

---

## 🛠️ Local Development Setup & Execution Workflow

To ensure stability, prevent port conflicts, and block browser CORS locks, execute this application using a stable **dual-terminal operational workflow**:

### Terminal Window 1: Launch the Backend API Server Engine
```bash
# Move into your project directory, install packages, and boot the server
npm run server
```
*The server will initialize a secure database pool connection and bind to http://localhost:5000.*

### Terminal Window 2: Launch the Frontend Client Interface
```bash
# Open a separate tab window and boot the Vite development server
npm run dev
```
*The application will lock onto port 5173 with active strictPort configurations at http://localhost:5173.*

### Terminal Window 3 (Optional): Execute the Automated Test Suite
```bash
# Run your Vitest integration integration suites
npm run test
```

---

## ⚙️ Key Technical Challenges Conquered

### 1. The macOS AirPlay Port 5000 Collision
*   **The Problem:** In recent macOS updates, Apple's ControlCenter service quietly hogs port 5000 for AirPlay functionality by default. This causes Express backend servers to either throw a connection error or load text headers without being able to process true network fetch routes.
*   **The Solution:** Identified the conflict using network inspection utilities and executed targeted terminal process termination commands (`kill -9 $(lsof -t -i:5000)`) to free up the port entirely for Node process cycles.

### 2. Prisma v7 Architectural Specifications
*   **The Problem:** Prisma v7 shifts from old asset bindings to light-weight, environment-specific imports. Standard configurations fallback to looking inside generic `node_modules` paths, which misses updated structural columns and relationship keys.
*   **The Solution:** Outfitted the system parameters with custom generation paths (`output = "./generated/client"`) and forced Prisma tools to map queries directly to the production folders using custom location execution flags.
