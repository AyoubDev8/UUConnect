import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to Azure Cosmos DB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

// Default welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the UUConnect Backend API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});