/**
 * Personal Task Manager - Production REST API Engine
 * High-performance backend engine built with Express.js, node-postgres connection pooling, 
 * and modern Prisma v7 Object-Relational Mapping (ORM) schema structures.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client/index.js'; 

// Initialize environment variables from localized secure environment configuration profiles
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * 1. PERSISTENT POSTGRESQL LAYER (Neon Cloud Pooling)
 * Establishes a robust database connection pool pointing directly to your Neon connection URL.
 * Forces rejectUnauthorized to false to comfortably pass secure cloud SSL handshake protocols.
 */
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

/**
 * 2. PRISMA CLIENT ENGINE SETUP (v7 Driver Adapter)
 * Instantiates the unified Prisma v7 Client using the modern relational database driver adapter pattern.
 */
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * 3. NETWORKING MIDDLEWARE CONFIGURATIONS
 * Restricts cross-origin resource access strictly to your active Vite frontend port (5173).
 * Formulates explicit headers and methods to clear preflight handshake requirements cleanly.
 */
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parses incoming json payload messages inside inbound request objects
app.use(express.json());

// Logger Middleware: Automatically prints activity traffic directly to your backend terminal
app.use((req, res, next) => {
  console.log(`📡 [API Traffic Monitor] Inbound: ${req.method} request received at ${req.path}`);
  next();
});

// Diagnostic check endpoint confirming backend server availability
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", message: "Task Manager Backend is active!" });
});
/**
 * 4. API CONTROLLER ROUTES (Full CRUD Implementation Loops)
 */

// ========================================================
// ROUTE 1: LIVE API READ ENDPOINT (GET)
// ========================================================
app.get('/api/tasks', async (req, res) => {
  try {
    // Queries all records from PostgreSQL table arranged chronologically by nearest deadlines
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

// ========================================================
// ROUTE 2: LIVE API CREATE ENDPOINT WITH USER LINK (POST)
// ========================================================
app.post('/api/tasks', async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    if (!name || !dueDate) {
      return res.status(400).json({ error: "Missing required fields: name and dueDate are mandatory." });
    }

    // SANITIZATION: Validates format strings to stop unhandled date parsing failures
    const cleanDate = new Date(dueDate);
    if (isNaN(cleanDate.getTime())) {
      return res.status(400).json({ error: "Invalid due date format received." });
    }

    // Inserts fresh task row, binding it automatically to your master presentation user ID 1
    const createdTask = await prisma.task.create({
      data: {
        name: name,
        description: description || null,
        dueDate: cleanDate, 
        isCompleted: false,
        userId: 1 
      }
    });

    res.status(201).json(createdTask);
  } catch (error) {
    console.error("❌ Database Write Failure:", error);
    res.status(500).json({ error: "Failed to write new task row into the database." });
  }
});

// ========================================================
// ROUTE 3: TOGGLE TASK COMPLETION STATUS (PUT)
// ========================================================
app.put('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Atomic data change flipping completion boolean properties safely
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { isCompleted: !existingTask.isCompleted }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Database Status Update Failure:", error);
    res.status(500).json({ error: "Failed to toggle task status in database." });
  }
});

// ========================================================
// ROUTE 4: UPDATE TASK CONTENT FIELDS DETAILS (PUT)
// ========================================================
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, dueDate } = req.body;

    if (!name || !dueDate) {
      return res.status(400).json({ error: "Name and due date parameters are required." });
    }

    // SANITIZATION FIX: Forces strict date coercion mapping for editing actions
    const cleanUpdateDate = new Date(dueDate);
    if (isNaN(cleanUpdateDate.getTime())) {
      return res.status(400).json({ error: "Invalid date conversion parameter passed." });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        description: description || null,
        dueDate: cleanUpdateDate
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Database Content Update Failure:", error);
    res.status(500).json({ error: "Failed to update task text content fields inside database." });
  }
});

// ========================================================
// ROUTE 5: ERASE A TASK ROW PERMANENTLY (DELETE)
// ========================================================
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Erases matching data records out of active cloud PostgreSQL table rows
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Task row deleted successfully." });
  } catch (error) {
    console.error("❌ Database Deletion Failure:", error);
    res.status(500).json({ error: "Failed to erase task row from database." });
  }
});

// Open active engine channel binding to dedicated network port
app.listen(PORT, () => {
  console.log(`🚀 Full-stack server running cleanly on http://localhost:${PORT}`);
});




