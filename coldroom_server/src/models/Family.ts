import { model, Schema } from "mongoose";

interface IFamily extends Document {
    name: string;
    college: Schema.Types.ObjectId;
    leader: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const FamilySchema = new Schema<IFamily>(
    {
      name: { type: String, required: true },
      college: { type: Schema.Types.ObjectId, ref: "College", required: true },
      leader: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    },
    { timestamps: true }
  );
  
  export const Family = model<IFamily>("Family", FamilySchema);
  