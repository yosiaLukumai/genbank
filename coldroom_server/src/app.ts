import express from 'express';
import { userRoutes } from './routes/users';
import { regionRoutes } from './routes/region';
import { CuRoutes } from './routes/CU';

import cors from "cors";
import { refrigeratorsRoutes } from './routes/fridges';
import { allLogs } from './routes/AllLogs';


const app = express();

app.use(express.json());
// enabling CORS
app.use(cors());

// testing the server
app.get("/ping", (req, res) => {
    res.send("pong");
});

userRoutes(app);
refrigeratorsRoutes(app);
allLogs(app);
export default app;