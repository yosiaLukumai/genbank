import { model, Schema, Document } from "mongoose";

interface IRegion extends Document {
    name: string;
    country: string; 
    email: string;
    contact: string; 
    createdAt: Date;
    updatedAt: Date;
  }
  
  const RegionSchema = new Schema<IRegion>(
    {
      name: { type: String, required: true, unique: true },
      country: { type: String, default: "Tanzania" },
      contact: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
  );
  
  export const Region = model<IRegion>("Region", RegionSchema);
  