const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });
    console.log('✅ MongoDB Connected Successfully');
    
    // Check connection status
    mongoose.connection.on('connected', () => {
      console.log('📊 Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.log('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from DB');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('🔧 Please check:');
    console.log('   1. MongoDB Atlas cluster is running');
    console.log('   2. Network access IP is 0.0.0.0/0');
    console.log('   3. Database user credentials are correct');
    console.log('   4. Internet connection is active');
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      getAllTasks: 'GET /api/tasks',
      createTask: 'POST /api/tasks',
      updateTask: 'PUT /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id'
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}`);
});