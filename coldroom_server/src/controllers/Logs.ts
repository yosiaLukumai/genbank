import { Request, Response } from "express";
import { LogModal } from "../models/Logs";
import { CreateResponse } from "../util/response";
import mongoose from "mongoose";
import { CreateLimitPage, CreatePaginatedOutput } from "../util/querying";


export const saveLog = async (req: Request, res: Response): Promise<any> => {
    try {
        const { roomtemp, roomhum, fridgetemp, fridgehum, fridgeID } = req.body;
        let fridge_id: mongoose.Types.ObjectId;
        try {
            fridge_id = new mongoose.Types.ObjectId(fridgeID);
        } catch (idError: any) {
            return res.json(CreateResponse(false, null, "Invalid fridgeID format"));
        }
        const newLog = await LogModal.create({
            roomtemp,
            roomhum,
            fridgetemp,
            fridgehum,
            fridgeID: fridge_id,
        })
        if (!newLog) {
            return res.json(CreateResponse(false, null, "Failed to create log"));
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
        const queryConditions: Record<string, any> = { ...filter };
        // let add some sort of regex to search
   

        const query = LogModal.find(queryConditions).populate("fridgeID","name _id");

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