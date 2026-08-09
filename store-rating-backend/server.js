const express = require('express');
const cors = require('cors');
const allowedOrigins = [
  'http://localhost:5173', // for local development
  'store-rating-system-challenge.vercel.app' // <-- PUT YOUR EXACT VERCEL URL HERE
];
require('dotenv').config();

const db = require('./config/db');

const app = express();

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const storeRoutes = require('./routes/stores');
app.use('/api/stores', storeRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const ownerRoutes = require('./routes/owner');
app.use('/api/owner', ownerRoutes);

// Middleware
app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

// Test Database Connection Route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully!', time: result.rows[0].now });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Store Rating API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});