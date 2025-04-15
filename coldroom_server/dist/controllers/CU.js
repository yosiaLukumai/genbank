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
exports.updateCU = exports.deleteCU = exports.getAllCUs = exports.getCUs = exports.createCU = void 0;
const response_1 = require("../util/response");
const querying_1 = require("../util/querying");
const Cu_1 = __importDefault(require("../models/Cu"));
const createCU = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, region, contactEmail, contactPhone, address, street, longitude, latitude, familiesEnabled } = req.body;
        const saved = yield Cu_1.default
            .create({
            name, region, contactEmail, contactPhone, address, street,
            longitude, latitude, familiesEnabled
        });
        if (!saved) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to create CU"));
        }
        return res.json((0, response_1.CreateResponse)(true, "CU created successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.createCU = createCU;
const getCUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { page: pageQuery, limit: limitQuery, search } = _a, filter = __rest(_a, ["page", "limit", "search"]);
        const { page, limit } = (0, querying_1.CreateLimitPage)(pageQuery, limitQuery);
        const skip = (page - 1) * limit;
        const queryConditions = Object.assign({}, filter);
        if (search) {
            queryConditions.name = { $regex: search, $options: 'i' };
        }
        const query = Cu_1.default.find(queryConditions);
        const [docs, totalDocs] = yield Promise.all([
            query.skip(skip).limit(limit).exec(),
            Cu_1.default.countDocuments(filter).exec(),
        ]);
        const data = (0, querying_1.CreatePaginatedOutput)(limit, totalDocs, page, docs);
        if (!data) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get CUs"));
        }
        return res.json((0, response_1.CreateResponse)(true, data));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getCUs = getCUs;
const getAllCUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CUs = yield Cu_1.default.find();
    if (!CUs) {
        return res.json((0, response_1.CreateResponse)(false, null, "Failed to get CUs"));
    }
    return res.json((0, response_1.CreateResponse)(true, CUs));
});
exports.getAllCUs = getAllCUs;
const deleteCU = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Cu_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to delete CU"));
        }
        return res.json((0, response_1.CreateResponse)(true, "CU deleted successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.deleteCU = deleteCU;
const updateCU = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, region, contactEmail, contactPhone, address, street, longitude, latitude, familiesEnabled } = req.body;
        const updated = yield Cu_1.default.findByIdAndUpdate(id, { name, region, contactEmail, contactPhone, address, street,
            longitude, latitude, familiesEnabled });
        if (!updated) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to update CU"));
        }
        return res.json((0, response_1.CreateResponse)(true, "CU updated successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.updateCU = updateCU;
