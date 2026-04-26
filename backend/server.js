const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const breachRoutes = require('./routes/breach');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/breaches', breachRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 BreachTrack API v1.0 - Running Perfectly!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.log('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 BreachTrack Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}`);
});