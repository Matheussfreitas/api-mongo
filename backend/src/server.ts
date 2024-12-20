import express from 'express';
import connectDB from './db';
import userRoutes from './routes/users'
import EntityManager from './models/entityManager';
import RouteManager from './routes/routeManager';

const app = express();
const PORT = 3001;
const entityManager = new EntityManager();
const routeManager = new RouteManager(entityManager);

app.use(express.json());

connectDB();

app.use('/api', userRoutes);
app.use('/api', routeManager.getRouter());

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));