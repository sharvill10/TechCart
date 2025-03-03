import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const port = process.env.PORT || 5002;

connectDB();
const app = express();

// Add these middleware lines before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this line

// Use the correct base path for API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Default route to check if the API is running
app.get('/', (req, res) => {
  res.send('API IS RUNNING');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});