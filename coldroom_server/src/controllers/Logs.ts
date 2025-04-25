import { Request, Response } from "express";
import { LogModal } from "../models/Logs";
import { CreateResponse } from "../util/response";
import { CreateLimitPage, CreatePaginatedOutput } from "../util/querying";
import Refrigerator from "../models/fridge";
import { FridgeAlertState } from "../models/fridgeAlertState";
import { send_sms } from "../services/sendsms";
import User from "../models/Users";
import { send_email } from "../services/sendemail";

interface fridgeData {
    fridgeID: string;
    fridgetemp: number;
    fridgehum: number;
    roomtemp?: number;
    roomhum?: number;
}

interface NewLogEntry {
    roomtemp: number;
    roomhum: number;
    fridges: fridgeData[];
}



export async function processLog() {
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
}


export const saveLog = async (req: Request, res: Response): Promise<any> => {
    try {
        const { roomtemp, roomhum, fridges }: NewLogEntry = req.body;
        // check the length of fridges
        if (fridges.length === 0) {
            return res.json(CreateResponse(false, null, "No fridges found"));
        }

        // check the length of fridges
        if (fridges.length <= 3) {
            // save but notify a data entry is missing

        }
        // add on each fridge roomtemp and roomhum
        let newLogs: fridgeData[] = fridges.map((fridge) => {
            return {
                fridgeID: fridge.fridgeID,
                fridgetemp: fridge.fridgetemp,
                fridgehum: fridge.fridgehum,
                roomtemp: roomtemp,
                roomhum: roomhum,
            };
        });

        const savedAllLogs = await LogModal.insertMany(newLogs);
        if (!savedAllLogs) {
            return res.json(CreateResponse(false, null, "Failed to save all logs"));
        }

        setImmediate(async () => {
            savedAllLogs.forEach(async (log) => {
                const fridge = await Refrigerator.findById(log.fridgeID);
                if (!fridge || !fridge.tempmax || !fridge.humiditymax || !log.roomtemp || !log.roomhum || !log.fridgetemp || !log.fridgehum)
                    return;
                const alertState = await FridgeAlertState.findOne({ fridgeID: log.fridgeID }) || new FridgeAlertState({ fridgeID: log.fridgeID });
                try {
                    if ((log.fridgetemp < fridge.tempmax || log.fridgehum > fridge.humiditymax) && !alertState.alertActive) {
                   
                        // get all users with notifications enabled
                        const users = await User.find({ sendNotification: true });

                        // email and phone number arrays
                        const emails: string[] = [];
                        const phoneNumbers: { phone: string }[] = [];
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
                            await send_email(emails, `<h1>Fridge ${fridge.name} has exceeded temperature or humidity limits</h1><p>Please check the fridge temperature and humidity immediately.</p>`);
                            // await send_email(emails, emails.length + " new logs found for " + fridge.name);
                        }
                        if (phoneNumbers.length > 0) {
                            // send sms notification
                            send_sms(`Fridge with Label ${fridge.name} has exceeded temperature or humidity limits, please check immediately.`, phoneNumbers);
                        }

                        alertState.alertActive = true;
                        alertState.lastNotifiedAt = new Date();
                        await alertState.save();


                    }
                    if ((log.fridgetemp <= fridge.tempmax && log.fridgehum <= fridge.humiditymax) && alertState.alertActive) {
                        alertState.alertActive = false;
                        await alertState.save();
                    }
                } catch (error) {
                    console.log("Error processing alert:", error);
                }
            });
        });

        return res.json(CreateResponse(true, "log created successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}


export const getLogsTable = async (req: Request, res: Response): Promise<any> => {
    try {

        const { page: pageQuery, limit: limitQuery, ...filter } = req.query;

        const { page, limit } = CreateLimitPage(pageQuery, limitQuery);
        const skip = (page - 1) * limit;
        // check if in filter there is a fridgeID
        let queryConditions: Record<string, any>;

        if (filter.fridgeID !== "null") {
            queryConditions = { ...filter };
        } else {
            // leave all other filter except fridgeID
            delete filter.fridgeID;
            queryConditions = { ...filter };
        }

        if (filter.date !== "null" && !filter.date) {
            const date = new Date();
            if (filter.date?.includes("week")) {
                date.setDate(date.getDate() - 7);
            } else {
                date.setDate(date.getDate() - 30);
            }
            queryConditions.createdAt = { $gte: date };
        } else {
            delete filter.date;
            queryConditions = { ...filter };
        }

        const query = LogModal.find(queryConditions).populate("fridgeID", "name _id").sort({ createdAt: -1 });

        const [docs, totalDocs] = await Promise.all([
            query.skip(skip).limit(limit).exec(),
            LogModal.countDocuments(filter as Record<string, any>).exec(),
        ]);
        const data = CreatePaginatedOutput(limit, totalDocs, page, docs);

        if (!data) {
            return res.json(CreateResponse(false, null, "Failed to get logs"));
        }
        return res.json(CreateResponse(true, data));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};