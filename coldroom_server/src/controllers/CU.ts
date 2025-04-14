import { Request, Response } from 'express';
import { CreateResponse } from '../util/response';
import { CreateLimitPage, CreatePaginatedOutput } from "../util/querying";
import CU from '../models/Cu';

export const createCU = async (req: Request, res: Response): Promise<any> => {
    try {
        const { 
            name, region, contactEmail, contactPhone, address,
            street, longitude, latitude, familiesEnabled
        } = req.body;
        const saved = await CU
        .create({ 
            name, region, contactEmail, contactPhone, address, street,
            longitude, latitude, familiesEnabled
        })
        if (!saved) {
            return res.json(CreateResponse(false, null, "Failed to create CU"));
        }
        return res.json(CreateResponse(true, "CU created successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};

export const getCUs = async (req: Request, res: Response): Promise<any> => {
    try {
        const { page: pageQuery, limit: limitQuery, search, ...filter } = req.query;
        const { page, limit } = CreateLimitPage(pageQuery, limitQuery);
        const skip = (page - 1) * limit;
        const queryConditions: Record<string, any> = { ...filter };
        if (search) {
            queryConditions.name = { $regex: search as string, $options: 'i' };
        }
        const query = CU.find(queryConditions);

        const [docs, totalDocs] = await Promise.all([
            query.skip(skip).limit(limit).exec(),
            CU.countDocuments(filter as Record<string, any>).exec(),
        ]);
        const data = CreatePaginatedOutput(limit, totalDocs, page, docs);
        if (!data) {
            return res.json(CreateResponse(false, null, "Failed to get CUs"));
        }
        return res.json(CreateResponse(true, data));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};

export const getAllCUs = async (req: Request, res: Response): Promise<any> => {
    const CUs = await CU.find();
    if (!CUs) {
        return res.json(CreateResponse(false, null, "Failed to get CUs"));
    }
    return res.json(CreateResponse(true, CUs));
};

export const deleteCU = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deleted = await CU.findByIdAndDelete(id);
        if (!deleted) {
            return res.json(CreateResponse(false, null, "Failed to delete CU"));
        }
        return res.json(CreateResponse(true, "CU deleted successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }       
};

export const updateCU = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, region, contactEmail, contactPhone, address, street,
            longitude, latitude, familiesEnabled} = req.body;
        const updated = await CU.findByIdAndUpdate(id, { name, region, contactEmail, contactPhone, address, street,
            longitude, latitude, familiesEnabled });
        if (!updated) {
            return res.json(CreateResponse(false, null, "Failed to update CU"));
        }
        return res.json(CreateResponse(true, "CU updated successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}; 