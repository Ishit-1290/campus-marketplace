// src/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import tagRoutes from './routes/tag.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from "cookie-parser";

const domain_port = "http://localhost:5173";
const app = express();
app.use(cors({
  origin: domain_port,
  credentials: true
}));



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", domain_port);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(cookieParser());

app.use(express.json());

// serve uploaded files (development)
app.use('/uploads', express.static(path.resolve('uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler (last)
app.use(errorHandler);

export default app;
