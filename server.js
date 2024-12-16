import express from 'express';
import connectDB from './db.js';
import userRoutes from './routes/users.js'

const app = express();
const PORT = 3001;

app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));