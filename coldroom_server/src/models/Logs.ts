import { model, Schema } from "mongoose";

interface Logs extends Document {
    roomtemp: number;
    roomhum: number;
    fridgetemp: number;
    fridgehum: number;
    fridgeID: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const LogsSchema = new Schema<Logs>(
    {
        roomtemp: { type: Number, required: true },
        roomhum: { type: Number, required: true },
        fridgetemp: { type: Number, required: true },
        fridgehum: { type: Number, required: true },
        fridgeID: { type: Schema.Types.ObjectId, ref: "Refrigerators", required: true },
    },
    { timestamps: true }
  );
  
  export const LogModal = model<Logs>("alllogs", LogsSchema);
  