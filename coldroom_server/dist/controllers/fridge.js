"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecificFridge = exports.getallLast = exports.deleteFridge = exports.getFridgesWithLatestLogs = exports.updateFridge = exports.getFridges = exports.addFridge = void 0;
const fridge_1 = __importDefault(require("../models/fridge"));
const response_1 = require("../util/response");
const Logs_1 = require("../models/Logs");
const addFridge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, capacity, humiditymax, tempmax, refrigerator_type } = req.body;
        const newFridge = yield fridge_1.default.create({
            name,
            capacity: Number(capacity),
            humiditymax: Number(humiditymax),
            tempmax: Number(tempmax),
            refrigerator_type: refrigerator_type,
        });
        if (!newFridge) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to create fridge"));
        }
        return res.json((0, response_1.CreateResponse)(true, "fridge created successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.addFridge = addFridge;
const getFridges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const fridges = yield fridge_1.default.findById(id);
        if (!fridges) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get fridges"));
        }
        // last five logs
        const lastFiveLogs = yield Logs_1.LogModal.find({ fridgeID: id })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        return res.json((0, response_1.CreateResponse)(true, {
            logs: lastFiveLogs,
            fridge: fridges,
        }));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getFridges = getFridges;
const updateFridge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, capacity, humiditymax, tempmax, refrigerator_type } = req.body;
        const updatedFridge = yield fridge_1.default.findByIdAndUpdate(id, {
            name,
            capacity: Number(capacity),
            humiditymax: Number(humiditymax),
            tempmax: Number(tempmax),
            refrigerator_type: refrigerator_type,
        });
        if (!updatedFridge) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to update fridge"));
        }
        return res.json((0, response_1.CreateResponse)(true, "fridge updated successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.updateFridge = updateFridge;
const getFridgesWithLatestLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fridges = yield fridge_1.default.find().lean();
        if (!fridges) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get fridges"));
        }
        const fridgesWithLogs = yield Promise.all(fridges.map((fridge) => __awaiter(void 0, void 0, void 0, function* () {
            const latestLog = yield Logs_1.LogModal.findOne({ fridgeID: fridge._id })
                .sort({ createdAt: -1 })
                .limit(1)
                .lean();
            return Object.assign(Object.assign({}, fridge), { latestLog: latestLog || null });
        })));
        return res.json((0, response_1.CreateResponse)(true, fridgesWithLogs));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getFridgesWithLatestLogs = getFridgesWithLatestLogs;
const deleteFridge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const fridge = yield fridge_1.default.findByIdAndDelete(id);
        if (!fridge) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to delete fridge"));
        }
        return res.json((0, response_1.CreateResponse)(true, "fridge deleted successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.deleteFridge = deleteFridge;
const getallLast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fridges = yield fridge_1.default.find().lean();
        if (!fridges) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get fridges"));
        }
        const fridgesWithLogs = yield Promise.all(fridges.map((fridge) => __awaiter(void 0, void 0, void 0, function* () {
            const latestLog = yield Logs_1.LogModal.find({ fridgeID: fridge._id })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();
            return Object.assign(Object.assign({}, fridge), { latestlog: latestLog || null });
        })));
        return res.json((0, response_1.CreateResponse)(true, fridgesWithLogs));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getallLast = getallLast;
const getSpecificFridge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // combine the logs
        const fridge = yield fridge_1.default.findById(id);
        if (!fridge) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get fridge"));
        }
        return res.json((0, response_1.CreateResponse)(true, fridge));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getSpecificFridge = getSpecificFridge;
