"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModal = void 0;
const mongoose_1 = require("mongoose");
const LogsSchema = new mongoose_1.Schema({
    roomtemp: { type: Number, required: true },
    roomhum: { type: Number, required: true },
    fridgetemp: { type: Number, required: true },
    fridgehum: { type: Number, required: true },
    fridgeID: { type: mongoose_1.Schema.Types.ObjectId, ref: "Refrigerators", required: true },
}, { timestamps: true });
exports.LogModal = (0, mongoose_1.model)("alllogs", LogsSchema);
