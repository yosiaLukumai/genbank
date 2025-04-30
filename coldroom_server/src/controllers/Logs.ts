import { Request, Response } from "express";
import { LogModal } from "../models/Logs";
import { CreateResponse } from "../util/response";
import { CreateLimitPage, CreatePaginatedOutput } from "../util/querying";
import Refrigerator from "../models/fridge";
import { FridgeAlertState } from "../models/fridgeAlertState";
import { send_sms } from "../services/sendsms";
import User from "../models/Users";
import { send_email } from "../services/sendemail";
import { log } from "node:console";

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

        // setImmediate(async () => {
        //     savedAllLogs.forEach(async (log) => {
        //         const fridge = await Refrigerator.findById(log.fridgeID);
        //         if (!fridge || !fridge.tempmax || !fridge.humiditymax || !log.roomtemp || !log.roomhum || !log.fridgetemp || !log.fridgehum)
        //             return;
        //         const alertState = await FridgeAlertState.findOne({ fridgeID: log.fridgeID }) || new FridgeAlertState({ fridgeID: log.fridgeID });
        //         try {
        //             if ((log.fridgetemp < fridge.tempmax || log.fridgehum > fridge.humiditymax) && !alertState.alertActive) {

        //                 // get all users with notifications enabled
        //                 const users = await User.find({ sendNotification: true });

        //                 // email and phone number arrays
        //                 const emails: string[] = [];
        //                 const phoneNumbers: { phone: string }[] = [];
        //                 users.forEach((user) => {
        //                     if (user.email) {
        //                         emails.push(user.email);
        //                     }
        //                     if (user.phoneNumber) {
        //                         phoneNumbers.push({
        //                             phone: user.phoneNumber,
        //                         });
        //                     }
        //                 });

        //                 console.log(emails);
        //                 console.log(phoneNumbers);

        //                 if (emails.length > 0) {
        //                     // send email notification
        //                     await send_email(emails, `<h1>Fridge ${fridge.name} has exceeded temperature or humidity limits</h1><p>Please check the fridge temperature and humidity immediately.</p>`);
        //                     // await send_email(emails, emails.length + " new logs found for " + fridge.name);
        //                 }
        //                 if (phoneNumbers.length > 0) {
        //                     // send sms notification
        //                     send_sms(`Fridge with Label ${fridge.name} has exceeded temperature or humidity limits, please check immediately.`, phoneNumbers);
        //                 }

        //                 alertState.alertActive = true;
        //                 alertState.lastNotifiedAt = new Date();
        //                 await alertState.save();


        //             }
        //             if ((log.fridgetemp <= fridge.tempmax && log.fridgehum <= fridge.humiditymax) && alertState.alertActive) {
        //                 alertState.alertActive = false;
        //                 await alertState.save();
        //             }
        //         } catch (error) {
        //             console.log("Error processing alert:", error);
        //         }
        //     });
        // });


        setImmediate(async () => {
            let alerts: { label: string, message: string, sms: string }[] = [];
            const processingPromises = savedAllLogs.map(async (log) => {
                try {
                    const fridge = await Refrigerator.findById(log.fridgeID);
                    if (!fridge || !fridge.tempmax || !fridge.humiditymax || !log.roomtemp || !log.roomhum || !log.fridgetemp || !log.fridgehum) {
                        return;
                    }
                    const alertState = await FridgeAlertState.findOne({ fridgeID: log.fridgeID }) || new FridgeAlertState({ fridgeID: log.fridgeID });
                    // console.log(`Fridge: ${fridge.name}, Log Temp: ${log.fridgetemp}, Max Temp: ${fridge.tempmax}`);
                    // console.log("One: ", log.fridgetemp < fridge.tempmax);
                    // console.log('Two: ', log.fridgehum > fridge.humiditymax);

                    // if ((log.fridgetemp < fridge.tempmax || log.fridgehum > fridge.humiditymax) && !alertState.alertActive) {
                    if ((log.fridgetemp < fridge.tempmax || log.fridgehum > fridge.humiditymax) && !alertState.alertActive) {
                        // check which notifications and push them to the alerts array
                        if (log.fridgetemp < fridge.tempmax) {
                            alerts.push({
                                label: fridge.name,
                                sms: "Temperature has exceeded threshold",
                                message: `has exceeded temperature limits. Current temperature: ${log.fridgetemp}°C, Maximum temperature: ${fridge.tempmax}°C`
                            })
                        }

                        if (log.fridgehum > fridge.humiditymax) {
                            alerts.push({
                                label: fridge.name,
                                sms: "Humidity has exceeded threshold",
                                message: `has exceeded humidity limits. Current humidity: ${log.fridgehum}%, Maximum humidity: ${fridge.humiditymax}%`
                            })
                        }
                        alertState.alertActive = true;
                        alertState.lastNotifiedAt = new Date();
                        await alertState.save();
                    } 
                    else if ((log.fridgetemp >= fridge.tempmax && log.fridgehum <= fridge.humiditymax) && alertState.alertActive) {
                        alertState.alertActive = false;
                        await alertState.save();
                    }
                } catch (error) {
                    console.log(`Error processing alert for fridge ID ${log.fridgeID}:`, error);
                    // Potentially handle the error in a way that doesn't stop other logs
                }
            });

            // Send notifications


            try {
                await Promise.all(processingPromises);
                if (alerts.length > 0) {
                    const users = await User.find({ sendNotification: true });
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

                    // console.log(emails);
                    // console.log(phoneNumbers);

                    // construct message
                    let longMessage = "";
                    alerts.map((alert, index) => {
                        longMessage += `${index + 0}. <h1> ${alert.label}-${alert.message}</h1><p>Please check the fridge temperature and humidity immediately.</p> \n`;
                        return longMessage;
                    })

                    if (emails.length > 0) {
                        await send_email(emails, longMessage);
                    }
                    // sms notification
                    let sms = ""
                    alerts.map((alert) => { 
                        sms += `${alert.label}-${alert.sms},`;
                        return sms;
                    })
                    
                    if (phoneNumbers.length > 0) {
                        send_sms(sms, phoneNumbers);
                    }
                }
                console.log("All logs processed.");
                // Any code that needs to run after all logs are processed can go here
            } catch (error) {
                console.error("An error occurred during log processing:", error);
            }
        });

        return res.json(CreateResponse(true, "log created successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}


// export const getLogsTable = async (req: Request, res: Response): Promise<any> => {
//     try {

//         const { page: pageQuery, limit: limitQuery, ...filter } = req.query;

//         const { page, limit } = CreateLimitPage(pageQuery, limitQuery);
//         const skip = (page - 1) * limit;
//         // check if in filter there is a fridgeID
//         // let queryConditions: Record<string, any>;
//         let queryConditions: Record<string, any> = { ...filter };

//         if (filter.fridgeID !== "null") {
//             queryConditions = { ...filter };
//         } else {
//             // leave all other filter except fridgeID
//             delete filter.fridgeID;
//             queryConditions = { ...filter };
//         }



//         // if (filter.date !== "null" && filter.date) {
//         //     const date = new Date();
//         //     console.log(filter.date, "jjejej");
//         //     if (filter.date?.includes("week")) {
//         //         date.setDate(date.getDate() - 7);
//         //     } else {
//         //         date.setDate(date.getDate() - 30);
//         //     }
//         //     queryConditions.createdAt = { $gte: date };
//         // } else {
//         //     delete filter.date;
//         //     queryConditions = { ...filter };
//         // }

//         // console.log(filter.startDate, filter.endDate, filter)

//         // if(filter.startDate && filter.endDate){
//         //     console.log("runned");

//         //     queryConditions.createdAt = { $gte: filter.startDate, $lte: filter.endDate };
//         // }else if(filter.startDate){
//         //     console.log("rn");

//         //     queryConditions.createdAt = { $gte: filter.startDate };
//         // }else if(filter.endDate){
//         //     console.log("djhs");

//         //     queryConditions.createdAt = { $lte: filter.endDate };
//         // }else {
//         //     console.log("del`");

//         //     delete filter.startDate;
//         //     delete filter.endDate;
//         //     queryConditions = { ...filter };
//         // }

//         if (filter.date && filter.date !== "null") {
//             const date = new Date();
//             if (filter.date.includes("week")) {
//                 date.setDate(date.getDate() - 7);
//             } else {
//                 date.setDate(date.getDate() - 30);
//             }
//             queryConditions.createdAt = { $gte: date };
//         } else if (filter.startDate || filter.endDate) {
//             if (filter.startDate && filter.endDate) {
//                 queryConditions.createdAt = { $gte: new Date(filter.startDate), $lte: new Date(filter.endDate) };
//             } else if (filter.startDate) {
//                 queryConditions.createdAt = { $gte: new Date(filter.startDate) };
//             } else if (filter.endDate) {
//                 queryConditions.createdAt = { $lte: new Date(filter.endDate) };
//             }
//         }





//         const query = LogModal.find(queryConditions).populate("fridgeID", "name _id").sort({ createdAt: -1 });

//         const [docs, totalDocs] = await Promise.all([
//             query.skip(skip).limit(limit).exec(),
//             LogModal.countDocuments(filter as Record<string, any>).exec(),
//         ]);
//         const data = CreatePaginatedOutput(limit, totalDocs, page, docs);

//         if (!data) {
//             return res.json(CreateResponse(false, null, "Failed to get logs"));
//         }
//         return res.json(CreateResponse(true, data));
//     } catch (error) {
//         return res.json(CreateResponse(false, null, error));
//     }
// };



export const getLogsTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { page: pageQuery, limit: limitQuery, ...filter } = req.query;

        const { page, limit } = CreateLimitPage(pageQuery, limitQuery);
        const skip = (page - 1) * limit;

        let queryConditions: Record<string, any> = { ...filter };

        if (filter.fridgeID !== "null") {
            queryConditions = { ...filter };
        } else {
            // leave all other filter except fridgeID
            delete filter.fridgeID;
            queryConditions = { ...filter };
        }

        const dateFilter = filter.date as string | undefined;
        const startDate = filter.startDate as string | undefined;
        const endDate = filter.endDate as string | undefined;



        if (dateFilter && dateFilter !== "null") {
            const date = new Date();
            if (dateFilter.includes("week")) {
                date.setDate(date.getDate() - 7);
            } else {
                date.setDate(date.getDate() - 30);
            }
            delete queryConditions.date;
            queryConditions.createdAt = { $gte: date };
        } else {
            delete filter.date;
            queryConditions = { ...filter };
        }



        if (startDate || endDate) {
            delete queryConditions.date;
            if (startDate && endDate) {
                queryConditions.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
            } else if (startDate) {
                queryConditions.createdAt = { $gte: new Date(startDate) };
            } else if (endDate) {
                queryConditions.createdAt = { $lte: new Date(endDate) };
            }
            delete filter.startDate;
            delete filter.endDate;
            delete queryConditions.startDate;
            delete queryConditions.endDate;
        } else {

            delete filter.startDate;
            delete filter.endDate;
        }



        const query = LogModal.find(queryConditions)
            .populate("fridgeID", "name _id")
            .sort({ createdAt: -1 });

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
