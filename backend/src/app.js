const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes     = require('./routes/authRoutes');
const listingRoutes  = require('./routes/listingRoutes');
const messageRoutes  = require('./routes/messageRoutes');
const uploadRoutes   = require('./routes/uploadRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

// Prisma keep-alive — Supabase free tier drops idle connections after ~5 min
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const DB_PING_INTERVAL = 4 * 60 * 1000; // every 4 minutes

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Use Routes
app.use('/api/auth',      authRoutes);
app.use('/api/listings',  listingRoutes);
app.use('/api/messages',  messageRoutes);
app.use('/api/upload',    uploadRoutes);
app.use('/api/purchases', purchaseRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'EduMart API is running smoothly! 🎓' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🎓 EduMart Server running on http://localhost:${PORT}`);

    // Keep the Supabase connection alive with a silent ping every 4 minutes
    setInterval(async () => {
        try {
            await prisma.$queryRaw`SELECT 1`;
            console.log('💓 DB keep-alive ping OK');
        } catch (e) {
            console.warn('⚠️  DB keep-alive failed — check Supabase project status:', e.message);
        }
    }, DB_PING_INTERVAL);
});