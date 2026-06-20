const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies

// Basic Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'StudyMart API is running smoothly!' });
});

// Test Database Connection Route
app.get('/api/users', async (req, res) => {
    try {
        // This queries your Supabase database via Prisma
        const users = await prisma.user.findMany();
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});