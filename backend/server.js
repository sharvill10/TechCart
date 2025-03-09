import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';
import path from 'path';

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
app.use('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}))

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});