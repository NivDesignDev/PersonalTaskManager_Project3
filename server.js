import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client/index.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Create a standard PostgreSQL database connection pool
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Initialize the Prisma v7 Driver Adapter wrapper
const adapter = new PrismaPg(pool);

// 3. Inject the adapter directly into your PrismaClient instance
const prisma = new PrismaClient({ adapter });

// Middleware configuration
app.use(cors());
app.use(express.json());

// Base test endpoint to verify the backend is awake
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", message: "Task Manager Backend is active!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Full-stack server running cleanly on http://localhost:${PORT}`);
});

