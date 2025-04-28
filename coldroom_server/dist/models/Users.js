"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    sendNotification: { type: Boolean, default: false }
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)('currentusers', userSchema);
exports.default = User;
