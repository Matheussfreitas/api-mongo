import { Router, Request, Response } from 'express';
import EntityManager from '../models/entityManager';
import CreateEntityRouter from './createEntityRouter';

export const setupEntityManagementRoutes = (entityManager: EntityManager): Router => {
    const router = Router();
    const createEntityRouter = new CreateEntityRouter();

    router.post('/entidades', async (req: Request, res: Response) => {
        try {
            const entityDef = req.body;
            await entityManager.createEntity(entityDef);
            createEntityRouter(entityManager);
            res.status(201).json({ message: `Entidade ${entityDef.name} criada com sucesso` });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });

    router.get('/entidades', async (req: Request, res: Response) => {
        try {
            const entities = await entityManager.getAllEntityNames();
            res.status(200).json({ entities });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    return router;
};
