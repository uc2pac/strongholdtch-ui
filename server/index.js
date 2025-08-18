require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

console.log('Starting Stronghold TCG API Server...');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || 5000);
console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

// Database middleware - attach pool to request object
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Import routes
const setsRoutes = require('./routes/sets');

// Use routes
app.use('/api/sets', setsRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      timestamp: result.rows[0].now,
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: 'Database connection failed' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎮 Sets API: http://localhost:${PORT}/api/sets`);
});
