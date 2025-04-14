import { model, Schema, Document } from "mongoose";

interface ILeadershipPosition extends Document {
    name: string; 
    category: "CU" | "Regional" | "National";
    createdAt: Date;
    updatedAt: Date;
  }
  
  const LeadershipPositionSchema = new Schema<ILeadershipPosition>(
    {
      name: { type: String, required: true, unique: true },
      category: { type: String, enum: ["CU", "Regional", "National"], required: true },
    },
    { timestamps: true }
  );
  
  export const LeadershipPosition = model<ILeadershipPosition>("LeadershipPosition", LeadershipPositionSchema);
  