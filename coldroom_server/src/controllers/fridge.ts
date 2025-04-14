import { Request, Response } from "express";
import Fridge from "../models/fridge"
import { CreateResponse } from "../util/response";
import { LogModal } from "../models/Logs";

export const addFridge = async (req: Request, res: Response): Promise<any> => {

    try {
        const { name, capacity, humiditymax, tempmax, refrigerator_type } = req.body;
        const newFridge =await Fridge.create({
            name,
            capacity: Number(capacity),
            humiditymax: Number(humiditymax),
            tempmax: Number(tempmax),
            refrigerator_type: refrigerator_type,
        })
        if (!newFridge) {
            return res.json(CreateResponse(false, null, "Failed to create fridge"));
        }
        return res.json(CreateResponse(true, "fridge created successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const getFridges = async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params
        const fridges = await Fridge.findById(id)
        if (!fridges) {
            return res.json(CreateResponse(false, null, "Failed to get fridges"));
        }
        // last five logs
        const lastFiveLogs = await LogModal.find({ fridgeID: id })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        return res.json(CreateResponse(true, {
            logs: lastFiveLogs,
            fridge: fridges,
        }));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}


export const getFridgesWithLatestLogs = async (req: Request, res: Response): Promise<any> => {
    try {
        const fridges = await Fridge.find().lean();
        if (!fridges) {
            return res.json(CreateResponse(false, null, "Failed to get fridges"));
        }
        const fridgesWithLogs = await Promise.all(
            fridges.map(async (fridge) => {
                const latestLog = await LogModal.findOne({ fridgeID: fridge._id })
                    .sort({ createdAt: -1 })
                    .limit(1)
                    .lean();

                return {
                    ...fridge,
                    latestLog: latestLog || null,
                };
            })
        );

        return res.json(CreateResponse(true, fridgesWithLogs));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};


export const getallLast = async (req: Request, res: Response): Promise<any> => {
    try {
        const fridges = await Fridge.find().lean();
        if (!fridges) {
            return res.json(CreateResponse(false, null, "Failed to get fridges"));
        }
        const fridgesWithLogs = await Promise.all(
            fridges.map(async (fridge) => {
                const latestLog = await LogModal.find({ fridgeID: fridge._id })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean();

                return {
                    ...fridge,
                    latestlog: latestLog || null,
                };
            })
        );

        return res.json(CreateResponse(true, fridgesWithLogs));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};
export const getSpecificFridge = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        // combine the logs

        const fridge = await Fridge.findById(id);
        if (!fridge) {
            return res.json(CreateResponse(false, null, "Failed to get fridge"));
        }
        return res.json(CreateResponse(true, fridge));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};