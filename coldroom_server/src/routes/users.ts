import express, { Router, Express } from 'express';
import * as userController from '../controllers/users';

const router: Router = express.Router();

const userRoutes = (app: Express): Express => {
    router.post('/create', userController.createUser);
    router.post('/login', userController.loginUser);
    router.patch('/update/:id', userController.updateUser);
    router.get('/all', userController.getUsers);
    router.get('/specific/:id', userController.getUser);
    router.delete('/delete/:id', userController.deleteUser);
    router.patch('/update/:id', userController.updatePassword);
    return app.use('/users', router);
};

export { userRoutes };