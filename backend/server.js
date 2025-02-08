import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
const port = process.env.PORT || 5002;

connectDB();
const app = express();

// Use the correct base path for API routes
app.use('/api/products', productRoutes);

// Default route to check if the API is running
app.get('/', (req, res) => {
  res.send('API IS RUNNING');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
