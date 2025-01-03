import { Router, Request, Response } from 'express';
import EntityManager from '../models/entityManager';

export const createEntityRoutes = (entityName: string) => {
    const router = Router();
    const entityManager = new EntityManager();

    const model = entityManager.getModel(entityName);

    if (!model) return;

    router.get('/', async (req: Request, res: Response) => {
        try {
            const { fields, page, limit } = req.query;

            const projection = fields
                ? (fields as string).split(',').reduce((acc, field) => {
                    acc[field.trim()] = 1;
                    return acc;
                }, {} as Record<string, number>)
                : {};

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;
            console.log("Buscando documentos da entidade:", entityName);
            const items = await model.find({}, projection).lean().skip(skip).limit(limitNumber);
        
            const totalDocuments = await model.countDocuments();
        
            res.json({
                entityName,
                totalDocuments,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalDocuments / limitNumber),
                items,
                });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.get('/:id', async (req: Request, res: Response): Promise<void> => {
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
    router.post('/', async (req: Request, res: Response) => {
        try {
            const item = new model(req.body);
            await item.save();
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });

    // PUT/Update item
    router.put('/:id', async (req: Request, res: Response): Promise<void> => {
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
    router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
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

    // Cria rotas da entidade
    router.use(`/${entityName}`, router);
}