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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogsTable = exports.saveLog = void 0;
const Logs_1 = require("../models/Logs");
const response_1 = require("../util/response");
const querying_1 = require("../util/querying");
const saveLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomtemp, roomhum, fridges } = req.body;
        // check the length of fridges
        if (fridges.length === 0) {
            return res.json((0, response_1.CreateResponse)(false, null, "No fridges found"));
        }
        // check the length of fridges
        if (fridges.length <= 3) {
            // save but notify a data entry is missing
        }
        // add on each fridge roomtemp and roomhum
        let newLogs = fridges.map((fridge) => {
            return {
                fridgeID: fridge.fridgeID,
                fridgetemp: fridge.fridgetemp,
                fridgehum: fridge.fridgehum,
                roomtemp: roomtemp,
                roomhum: roomhum,
            };
        });
        const savedAllLogs = yield Logs_1.LogModal.insertMany(newLogs);
        if (!savedAllLogs) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to save all logs"));
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
        // check if in filter there is a fridgeID
        let queryConditions;
        if (filter.fridgeID !== "null") {
            queryConditions = Object.assign({}, filter);
        }
        else {
            // leave all other filter except fridgeID
            delete filter.fridgeID;
            queryConditions = Object.assign({}, filter);
        }
        const query = Logs_1.LogModal.find(queryConditions).populate("fridgeID", "name _id").sort({ createdAt: -1 });
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
