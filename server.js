const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);

