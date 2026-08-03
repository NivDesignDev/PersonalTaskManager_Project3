import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client/index.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Create a secure PostgreSQL database connection pool with explicit SSL configurations
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // <-- This forces your backend to safely trust the Neon cloud certificate parameters
  }
});


// 2. Initialize the Prisma v7 Driver Adapter wrapper
const adapter = new PrismaPg(pool);

// 3. Inject the adapter directly into your PrismaClient instance
const prisma = new PrismaClient({ adapter });

// Middleware configuration (Explicitly configured for port 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Base test endpoint to verify the backend is awake
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", message: "Task Manager Backend is active!" });
});

// ROUTE 1: LIVE API READ ENDPOINT (GET)
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
// ========================================================
// ROUTE 2: LIVE API CREATE ENDPOINT (POST) - Bulletproof
// ========================================================
app.post('/api/tasks', async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    if (!name || !dueDate) {
      return res.status(400).json({ error: "Missing required fields: name and dueDate are mandatory." });
    }

    // SANITIZATION: Forces a clean ISO format string to prevent timestamp parse rejections
    const cleanDate = new Date(dueDate);
    if (isNaN(cleanDate.getTime())) {
      return res.status(400).json({ error: "Invalid due date format received." });
    }

    const createdTask = await prisma.task.create({
      data: {
        name: name,
        description: description || null,
        dueDate: cleanDate, // Passes the verified valid date object directly to Prisma
        isCompleted: false 
      }
    });

    res.status(201).json(createdTask);
  } catch (error) {
    console.error("❌ Database Write Failure:", error);
    res.status(500).json({ error: "Failed to write new task row into the database." });
  }
});

// ROUTE 3: TOGGLE TASK COMPLETION STATUS (PUT)
app.put('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found." });
    }

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

// ROUTE 4: UPDATE TASK CONTENT FIELDS DETAILS (PUT)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, dueDate } = req.body;

    if (!name || !dueDate) {
      return res.status(400).json({ error: "Name and due date parameters are required." });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        description: description || null,
        dueDate: new Date(dueDate)
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Database Content Update Failure:", error);
    res.status(500).json({ error: "Failed to update task text content fields inside database." });
  }
});

// ROUTE 5: ERASE A TASK ROW PERMANENTLY (DELETE)
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Task row deleted successfully." });
  } catch (error) {
    console.error("❌ Database Deletion Failure:", error);
    res.status(500).json({ error: "Failed to erase task row from database." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Full-stack server running cleanly on http://localhost:${PORT}`);
});
