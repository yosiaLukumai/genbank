import { model, Schema } from "mongoose";

interface ILeadership extends Document {
    student: Schema.Types.ObjectId;
    roles: {
      position: Schema.Types.ObjectId;
      category: "CU" | "Regional" | "National";
      department?: Schema.Types.ObjectId;
      term_start: Date;
      term_end: Date;
      banned: boolean;
    }[];
    total_terms: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const LeadershipSchema = new Schema<ILeadership>(
    {
      student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
      roles: [
        {
          position: { type: Schema.Types.ObjectId, ref: "LeadershipPosition", required: true },
          category: { type: String, enum: ["CU", "Regional", "National"], required: true },
          department: { type: Schema.Types.ObjectId, ref: "LeadershipDepartment" },
          term_start: { type: Date, required: true, default: Date.now },
          term_end: { type: Date, required: true, default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1)) },
          banned: { type: Boolean, default: false },
        },
      ],
      total_terms: { type: Number, default: 0 },
    },
    { timestamps: true }
  );
  
  export const Leadership = model<ILeadership>("Leadership", LeadershipSchema);
  