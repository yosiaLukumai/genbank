import express, { Router, Express } from 'express';
import * as refrigeratorController from '../controllers/fridge';

const router: Router = express.Router();

const refrigeratorsRoutes = (app: Express): Express => {
    router.post('', refrigeratorController.addFridge);
    router.get('', refrigeratorController.getFridges);
    router.get("/specific/:id", refrigeratorController.getFridges);
    router.get("/last/all", refrigeratorController.getallLast);
    router.get("/last", refrigeratorController.getFridgesWithLatestLogs);

    return app.use('/refrigerators', router);
};

export { refrigeratorsRoutes };