import { Schema, model, Types } from 'mongoose';

export interface ICU {
    name: string;
    region: Types.ObjectId;
    contactEmail?: string;
    contactPhone?: string;
    familiesEnabled: boolean;
    street?: string;
    address?: string;
    longitude?: number;
    latitude?: number;
    createdAt: Date;
    updatedAt: Date;
}

const cuSchema = new Schema<ICU>(
    {
        name: { type: String, required: true },
        region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
        contactEmail: { type: String },
        contactPhone: { type: String },
        address: { type: String },
        street: { type: String },
        longitude: { type: Number, required: false },
        latitude: { type: Number, required: false },
        familiesEnabled: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const CU = model<ICU>('CU', cuSchema);

export default CU;
