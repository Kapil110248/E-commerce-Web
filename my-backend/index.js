const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();


// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});
