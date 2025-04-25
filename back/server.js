import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import restaurantRoutes from './routes/resturantRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { createInitialAdmin } from './controllers/adminController.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB().then(() => {
  createInitialAdmin(); // Create admin user if doesn't exist
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin', adminRoutes);

// Unified dishes endpoint
app.get('/api/dishes', async (req, res, next) => {
  try {
    const { getAllProducts } = await import('./controllers/productControllers.js');
    await getAllProducts(req, res);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({ 
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
const PORT = process.env.PORT || 8081;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
  server.close(() => process.exit(1));
});