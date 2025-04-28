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
exports.updatePassword = exports.deleteUser = exports.getUser = exports.getUsers = exports.loginUser = exports.updateUser = exports.createUser = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const response_1 = require("../util/response");
const passwords_1 = require("../util/passwords");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, role, sendNotification, phoneNumber } = req.body;
    // has password first
    try {
        let hashedPassword = yield (0, passwords_1.hashPassword)(password);
        if (!hashedPassword) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to hash password"));
        }
        let saved = yield Users_1.default.create({
            email,
            name,
            password: hashedPassword,
            role,
            sendNotification,
            phoneNumber,
        });
        if (saved) {
            return res.json((0, response_1.CreateResponse)(true, "User created.."));
        }
        else {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to create user"));
        }
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, password, role, sendNotification, phoneNumber } = req.body;
    try {
        // hash password
        let hashedPassword = yield (0, passwords_1.hashPassword)(password);
        if (!hashedPassword) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to hash password"));
        }
        const updated = yield Users_1.default.findByIdAndUpdate(id, {
            name,
            email,
            password: hashedPassword,
            role,
            sendNotification,
            phoneNumber,
        });
        if (!updated) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to update user"));
        }
        return res.json((0, response_1.CreateResponse)(true, "User updated successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.updateUser = updateUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield Users_1.default.findOne({ email });
        if (!user) {
            return res.json((0, response_1.CreateResponse)(false, null, "User not found"));
        }
        // const isPasswordCorrect = await hashPassword(password);
        const comparison = yield (0, passwords_1.comparePassword)(password, user.password);
        if (comparison) {
            return res.json((0, response_1.CreateResponse)(true, user));
        }
        else {
            return res.json((0, response_1.CreateResponse)(false, null, "Incorrect password"));
        }
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.loginUser = loginUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Users_1.default.find();
        if (!users) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get users"));
        }
        return res.json((0, response_1.CreateResponse)(true, users));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield Users_1.default.findById(id);
        if (!user) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to get user"));
        }
        return res.json((0, response_1.CreateResponse)(true, user));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Users_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to delete user"));
        }
        return res.json((0, response_1.CreateResponse)(true, "User deleted successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.deleteUser = deleteUser;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { password, previousPassword } = req.body;
        if (previousPassword) {
            const isPasswordCorrect = yield (0, passwords_1.hashPassword)(previousPassword);
            if (!isPasswordCorrect) {
                return res.json((0, response_1.CreateResponse)(false, null, "Incorrect password"));
            }
        }
        // hash password
        let hashedPassword = yield (0, passwords_1.hashPassword)(password);
        if (!hashedPassword) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to hash password"));
        }
        const updated = yield Users_1.default.findByIdAndUpdate(id, { hashedPassword });
        if (!updated) {
            return res.json((0, response_1.CreateResponse)(false, null, "Failed to update password"));
        }
        return res.json((0, response_1.CreateResponse)(true, "Password updated successfully"));
    }
    catch (error) {
        return res.json((0, response_1.CreateResponse)(false, null, error));
    }
});
exports.updatePassword = updatePassword;
