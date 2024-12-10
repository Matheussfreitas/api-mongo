import express from 'express';
import connectDB from './db.js';
import userRoutes from './routes/users.js'

const app = express();

app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);

