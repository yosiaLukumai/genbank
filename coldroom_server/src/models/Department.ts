import { model, Schema } from "mongoose";

interface ILeadershipDepartment extends Document {
    name: string; 
    createdAt: Date;
    updatedAt: Date;
  }
  
  const LeadershipDepartmentSchema = new Schema<ILeadershipDepartment>(
    {
      name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
  );
  
  export const LeadershipDepartment = model<ILeadershipDepartment>("LeadershipDepartment", LeadershipDepartmentSchema);
  