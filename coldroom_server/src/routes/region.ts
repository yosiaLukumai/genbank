import express, { Router, Express } from 'express';
import * as regionController from '../controllers/regions';

const router: Router = express.Router();

const regionRoutes = (app: Express): Express => {
    router.post('', regionController.createRegion);
    router.get('', regionController.getRegions);
    router.delete("/:id", regionController.deleteRegion);
    router.patch("/:id", regionController.updateRegion);
    return app.use('/regions', router);
};

export { regionRoutes };