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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogsTable = exports.saveLog = void 0;
const Logs_1 = require("../models/Logs");
const response_1 = require("../util/response");
const mongoose_1 = __importDefault(require("mongoose"));
const querying_1 = require("../util/querying");
const saveLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomtemp, roomhum, fridgetemp, fridgehum, fridgeID } = req.body;
        let fridge_id;
        try {
            fridge_id = new mongoose_1.default.Types.ObjectId(fridgeID);
        }
        catch (idError) {
            return res.json((0, response_1.CreateResponse)(false, null, "Invalid fridgeID format"));
        }
        const newLog = yield Logs_1.LogModal.create({
            roomtemp,
            roomhum,
            fridgetemp,
            fridgehum,
            fridgeID: fridge_id,
        });
        if (!newLog) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to create log"));
        }
        return res.json((0, response_1.CreateResponse)(true, "log created successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.saveLog = saveLog;
const getLogsTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { page: pageQuery, limit: limitQuery } = _a, filter = __rest(_a, ["page", "limit"]);
        // console.log(pageQuery, limitQuery, search, filter);
        const { page, limit } = (0, querying_1.CreateLimitPage)(pageQuery, limitQuery);
        const skip = (page - 1) * limit;
        const queryConditions = Object.assign({}, filter);
        // let add some sort of regex to search
        const query = Logs_1.LogModal.find(queryConditions).populate("fridgeID", "name _id");
        const [docs, totalDocs] = yield Promise.all([
            query.skip(skip).limit(limit).exec(),
            Logs_1.LogModal.countDocuments(filter).exec(),
        ]);
        const data = (0, querying_1.CreatePaginatedOutput)(limit, totalDocs, page, docs);
        if (!data) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get logs"));
        }
        return res.json((0, response_1.CreateResponse)(true, data));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getLogsTable = getLogsTable;
