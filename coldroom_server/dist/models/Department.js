"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadershipDepartment = void 0;
const mongoose_1 = require("mongoose");
const LeadershipDepartmentSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });
exports.LeadershipDepartment = (0, mongoose_1.model)("LeadershipDepartment", LeadershipDepartmentSchema);
