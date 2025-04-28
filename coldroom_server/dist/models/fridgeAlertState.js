"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FridgeAlertState = void 0;
const mongoose_1 = require("mongoose");
const FridgeAlertStateSchema = new mongoose_1.Schema({
    fridgeID: { type: mongoose_1.Schema.Types.ObjectId, ref: "Refrigerators", required: true, unique: true },
    alertActive: { type: Boolean, default: false },
    parameter: { type: String, enum: ['temperature', 'humidity', null], default: null },
    lastNotifiedAt: { type: Date },
});
exports.FridgeAlertState = (0, mongoose_1.model)("fridgealertstate", FridgeAlertStateSchema);
