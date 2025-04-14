import express, { Router, Express } from 'express';
import * as LogsController from '../controllers/Logs';

const router: Router = express.Router();

const allLogs = (app: Express): Express => {
    router.post("", LogsController.saveLog);
    router.get("/table", LogsController.getLogsTable)
    return app.use('/alllogs', router);
};

export { allLogs };