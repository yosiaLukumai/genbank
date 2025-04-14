import express, {Router, Express} from 'express';
import * as CuController from '../controllers/CU';

const router: Router = express.Router();

const CuRoutes = (app: Express): Express => {
    router.post('', CuController.createCU);
    router.get('', CuController.getCUs);
    router.get('/all', CuController.getAllCUs);
    router.delete('/:id', CuController.deleteCU);
    router.patch('/:id', CuController.updateCU);
    return app.use('/cu', router);
}

export {CuRoutes};