import { Request, Response } from "express";
import { Region } from "../models/Region";
import { CreateResponse } from "../util/response";
import { CreateLimitPage, CreatePaginatedOutput } from "../util/querying";


export const createRegion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, contact } = req.body;
        const saved = await Region.create({ name, contact, email })
        if (!saved) {
            return res.json(CreateResponse(false, null, "Failed to create region"));
        }
        return res.json(CreateResponse(true, "region created successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};

export const getRegions = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const { page: pageQuery, limit: limitQuery, search, ...filter } = req.query;
        // console.log(pageQuery, limitQuery, search, filter);
        const { page, limit } = CreateLimitPage(pageQuery, limitQuery);
        const skip = (page - 1) * limit;
        const queryConditions: Record<string, any> = { ...filter };
        // let add some sort of regex to search
        if (search && search !== "") {
            queryConditions.name = { $regex: search as string, $options: 'i' };
            // If you are searching across multiple fields using $or:
            // const searchConditions = [];
            // searchConditions.push({ name: { $regex: search as string, $options: 'i' } });
            // // ... other fields with the $regex option
            // queryConditions.$or = searchConditions;
        }

        const query = Region.find(queryConditions);


        const [docs, totalDocs] = await Promise.all([
            query.skip(skip).limit(limit).exec(),
            Region.countDocuments(filter as Record<string, any>).exec(),
        ]);
        const data = CreatePaginatedOutput(limit, totalDocs, page, docs);
        
        if (!data) {
            return res.json(CreateResponse(false, null, "Failed to get regions"));
        }
        return res.json(CreateResponse(true, data));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};


export const getallRegions = async (req: Request, res: Response): Promise<any> => {
    const regions = await Region.find();
    if (!regions) {
        return res.json(CreateResponse(false, null, "Failed to get regions"));
    }
    return res.json(CreateResponse(true, regions));
};

export const deleteRegion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deleted = await Region.findByIdAndDelete(id);
        if (!deleted) {
            return res.json(CreateResponse(false, null, "Failed to delete region"));
        }
        return res.json(CreateResponse(true, "Region deleted successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const updateRegion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, email, contact } = req.body;
        const updated = await Region.findByIdAndUpdate(id, { name, email, contact });
        if (!updated) {
            return res.json(CreateResponse(false, null, "Failed to update region"));
        }
        return res.json(CreateResponse(true, "Region updated successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}