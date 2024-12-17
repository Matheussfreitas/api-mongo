import express from 'express';
import connectDB from './db.ts';
import userRoutes from './routes/users.ts'

const app = express();
const PORT = 3001;

app.use(express.json());

connectDB();

app.use('/api', userRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));