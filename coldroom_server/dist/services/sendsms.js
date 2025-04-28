"use strict";
// export const SendSMS = async (numbers: string[], message: string, reference: string): Promise<any> => {
//     try {
//         const response =await fetch("https://messaging-service.co.tz/api/sms/v1/test/text/single", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Basic `,
//                 "Accept": "application/json",
//             },
//             body: JSON.stringify({
//                 from: "N-SMS",
//                 to: numbers,
//                 text: message,
//                 reference: reference
//             })
//         })
//         const result = await response.text();
//         if(result) {
//             return "message sent"
//         }else {
//             return result;
//         }
//     } catch (error: any) {
//         return error.message || error.toString() || error;
//     }
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_sms = send_sms;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const btoa_1 = __importDefault(require("btoa"));
// Environment variables
const api_key = process.env.BEEM_API_KEY;
const secret_key = process.env.BEEM_SECRET_KEY;
const source_addr = process.env.SOURCE_ADDRESS;
const content_type = "application/json";
// Helper function to format phone numbers
const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('0') && phoneNumber.length === 10) {
        return '255' + phoneNumber.substring(1);
    }
    return phoneNumber;
};
// Function to send SMS
function send_sms(message, recipients) {
    axios_1.default
        .post("https://apisms.beem.africa/v1/send", {
        source_addr,
        schedule_time: "",
        encoding: 0,
        message,
        recipients: recipients.map((recipient, index) => ({
            recipient_id: index + 1,
            dest_addr: formatPhoneNumber(recipient.phone),
        })),
    }, {
        headers: {
            "Content-Type": content_type,
            Authorization: "Basic " + (0, btoa_1.default)(`${api_key}:${secret_key}`),
        },
        httpsAgent: new https_1.default.Agent({
            rejectUnauthorized: false,
        }),
    })
        .then((response) => console.log("SMS sent:", response.data))
        .catch((error) => {
        var _a;
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            console.error("SMS error:", error.response.data);
        }
        else {
            console.error("SMS error:", error.message);
        }
    });
}
