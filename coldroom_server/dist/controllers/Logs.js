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
exports.processLog = processLog;
const Logs_1 = require("../models/Logs");
const response_1 = require("../util/response");
const querying_1 = require("../util/querying");
const fridge_1 = __importDefault(require("../models/fridge"));
const fridgeAlertState_1 = require("../models/fridgeAlertState");
const sendsms_1 = require("../services/sendsms");
const Users_1 = __importDefault(require("../models/Users"));
const sendemail_1 = require("../services/sendemail");
function processLog() {
    return __awaiter(this, void 0, void 0, function* () {
        // const fridge = await Refrigerator.findById(log.fridgeID);
        // const alertState = await FridgeAlertState.findOne({ fridgeID: log.fridgeID }) 
        //                   || new FridgeAlertState({ fridgeID: log.fridgeID });
        // const thresholdExceeded = /* your logic */;
        // if (thresholdExceeded && !alertState.alertActive) {
        //     // Send SMS and/or Email
        //     await send_sms(...);
        //     await sens(...);
        //     alertState.alertActive = true;
        //     await alertState.save();
        // } else if (!thresholdExceeded && alertState.alertActive) {
        //     alertState.alertActive = false;
        //     await alertState.save();
        // }
    });
}
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
        setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
            savedAllLogs.forEach((log) => __awaiter(void 0, void 0, void 0, function* () {
                const fridge = yield fridge_1.default.findById(log.fridgeID);
                if (!fridge || !fridge.tempmax || !fridge.humiditymax || !log.roomtemp || !log.roomhum || !log.fridgetemp || !log.fridgehum)
                    return;
                const alertState = (yield fridgeAlertState_1.FridgeAlertState.findOne({ fridgeID: log.fridgeID })) || new fridgeAlertState_1.FridgeAlertState({ fridgeID: log.fridgeID });
                try {
                    if ((log.fridgetemp < fridge.tempmax || log.fridgehum > fridge.humiditymax) && !alertState.alertActive) {
                        // get all users with notifications enabled
                        const users = yield Users_1.default.find({ sendNotification: true });
                        // email and phone number arrays
                        const emails = [];
                        const phoneNumbers = [];
                        users.forEach((user) => {
                            if (user.email) {
                                emails.push(user.email);
                            }
                            if (user.phoneNumber) {
                                phoneNumbers.push({
                                    phone: user.phoneNumber,
                                });
                            }
                        });
                        if (emails.length > 0) {
                            // send email notification
                            yield (0, sendemail_1.send_email)(emails, `<h1>Fridge ${fridge.name} has exceeded temperature or humidity limits</h1><p>Please check the fridge temperature and humidity immediately.</p>`);
                            // await send_email(emails, emails.length + " new logs found for " + fridge.name);
                        }
                        if (phoneNumbers.length > 0) {
                            // send sms notification
                            (0, sendsms_1.send_sms)(`Fridge with Label ${fridge.name} has exceeded temperature or humidity limits, please check immediately.`, phoneNumbers);
                        }
                        alertState.alertActive = true;
                        alertState.lastNotifiedAt = new Date();
                        yield alertState.save();
                    }
                    if ((log.fridgetemp <= fridge.tempmax && log.fridgehum <= fridge.humiditymax) && alertState.alertActive) {
                        alertState.alertActive = false;
                        yield alertState.save();
                    }
                }
                catch (error) {
                    console.log("Error processing alert:", error);
                }
            }));
        }));
        return res.json((0, response_1.CreateResponse)(true, "log created successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.saveLog = saveLog;
const getLogsTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const _b = req.query, { page: pageQuery, limit: limitQuery } = _b, filter = __rest(_b, ["page", "limit"]);
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
        if (filter.date !== "null" && !filter.date) {
            const date = new Date();
            if ((_a = filter.date) === null || _a === void 0 ? void 0 : _a.includes("week")) {
                date.setDate(date.getDate() - 7);
            }
            else {
                date.setDate(date.getDate() - 30);
            }
            queryConditions.createdAt = { $gte: date };
        }
        else {
            delete filter.date;
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
