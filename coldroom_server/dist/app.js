"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./routes/users");
const cors_1 = __importDefault(require("cors"));
const fridges_1 = require("./routes/fridges");
const AllLogs_1 = require("./routes/AllLogs");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// enabling CORS
app.use((0, cors_1.default)());
// testing the server
app.get("/ping", (req, res) => {
    res.send("pong");
});
(0, users_1.userRoutes)(app);
(0, fridges_1.refrigeratorsRoutes)(app);
(0, AllLogs_1.allLogs)(app);
exports.default = app;
