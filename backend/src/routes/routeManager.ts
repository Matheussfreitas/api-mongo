import { Router, Request, Response } from 'express';
import EntityManager from './models/entityManager';

export default class RouteManager {
    private router: Router;
    private entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this.router = Router();
        this.entityManager = entityManager;
        this.setupEntityManagementRoutes();
    }

    private setupEntityManagementRoutes() {
        // Route to create new entity
        this.router.post('/entities', async (req: Request, res: Response) => {
            try {
                const entityDef = req.body;
                const model = await this.entityManager.createEntity(entityDef);
                this.createEntityRoutes(entityDef.name);
                res.status(201).json({ message: `Entity ${entityDef.name} created successfully` });
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });
    }

    private createEntityRoutes(entityName: string) {
        const entityRouter = Router();
        const model = this.entityManager.getModel(entityName);

        if (!model) return;

        // GET all with projection
        entityRouter.get('/', async (req: Request, res: Response) => {
            try {
                const { fields } = req.query;
                const projection = fields
                    ? (fields as string).split(',').reduce((acc, field) => {
                        acc[field.trim()] = 1;
                        return acc;
                    }, {} as Record<string, number>)
                    : {};

                const items = await model.find({}, projection);
                res.json(items);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        // GET one with projection
        entityRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
            try {
                const { fields } = req.query;
                const projection = fields
                    ? (fields as string).split(',').reduce((acc, field) => {
                        acc[field.trim()] = 1;
                        return acc;
                    }, {} as Record<string, number>)
                    : {};

                const item = await model.findById(req.params.id, projection);
                if (!item) {
                    res.status(404).json({ error: 'Not found' });
                    return ;
                }
                res.json(item);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        // POST new item
        entityRouter.post('/', async (req: Request, res: Response) => {
            try {
                const item = new model(req.body);
                await item.save();
                res.status(201).json(item);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        // PUT/Update item
        entityRouter.put('/:id', async (req: Request, res: Response): Promise<void> => {
            try {
                const item = await model.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true, runValidators: true }
                );
                if (!item) {
                    res.status(404).json({ error: 'Not found' });
                    return;
                }
                res.json(item);
            } catch (error) {
                res.status(400).json({ error: (error as Error).message });
            }
        });

        // DELETE item
        entityRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
            try {
                const item = await model.findByIdAndDelete(req.params.id);
                if (!item) {
                    res.status(404).json({ error: 'Not found' });
                    return;
                }
                res.status(204).send();
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        // Mount the entity routes
        this.router.use(`/${entityName}`, entityRouter);
    }

    getRouter(): Router {
        return this.router;
    }
}