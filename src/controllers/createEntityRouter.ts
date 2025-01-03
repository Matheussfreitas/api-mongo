import { Router } from 'express';
import EntityManager from '../models/entityManager';
import { setupEntityManagementRoutes } from './entityManager.routes';

export default class CreateEntityRouter {
    private router: Router;
    private entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this.router = Router();
        this.entityManager = entityManager;
        this.router.use('/', setupEntityManagementRoutes(this.entityManager));
        this.setupRoutesForExistingEntities();
    }

    private setupRoutesForExistingEntities() {
        const entityNames = this.entityManager.getAllEntityNames();

        entityNames.forEach((entityName) => {
            const model = this.entityManager.getModel(entityName);
            if (model) {
                this.router.use(`/${entityName}`, createEntityRouter(model, entityName));
            }
        });
    }

    getRouter(): Router {
        return this.router;
    }
}