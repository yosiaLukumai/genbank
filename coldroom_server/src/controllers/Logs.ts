import { Request, Response } from "express";
import { LogModal } from "../models/Logs";
import { CreateResponse } from "../util/response";
import { CreateLimitPage, CreatePaginatedOutput } from "../util/querying";

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

export const saveLog = async (req: Request, res: Response): Promise<any> => {
    try {
        const { roomtemp, roomhum, fridges }: NewLogEntry = req.body;
        // check the length of fridges
        if (fridges.length === 0) {
            return res.json(CreateResponse(false, null, "No fridges found"));
        }

        // check the length of fridges
        if(fridges.length <= 3) {
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

      
        return res.json(CreateResponse(true, "log created successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}


export const getLogsTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { page: pageQuery, limit: limitQuery, ...filter } = req.query;
        // console.log(pageQuery, limitQuery, search, filter);
        const { page, limit } = CreateLimitPage(pageQuery, limitQuery);
        const skip = (page - 1) * limit;
        // check if in filter there is a fridgeID
        let queryConditions: Record<string, any>;

        if (filter.fridgeID !== "null") {
            queryConditions = { ...filter};
        }else {
            // leave all other filter except fridgeID
            delete filter.fridgeID;
            queryConditions = { ...filter };
        }

        const query = LogModal.find(queryConditions).populate("fridgeID","name _id").sort({createdAt: -1});

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