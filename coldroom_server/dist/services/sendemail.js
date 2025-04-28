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
exports.send_email = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const send_email = (emails, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield resend.emails.send({
            from: "alert@resend.dev",
            to: emails,
            subject: "Alert Threshold Compromised",
            html: message,
        });
        if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.id) {
            return "Email sent successfully";
        }
        else {
            return "Failed to send email";
        }
    }
    catch (error) {
        return error.message || error.toString() || error;
    }
});
exports.send_email = send_email;
