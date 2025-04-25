import { model, Schema, Document } from "mongoose";
interface IFridgeAlertState extends Document {
    fridgeID: Schema.Types.ObjectId;
    alertActive: boolean;
    lastNotifiedAt?: Date;
    parameter: 'temperature' | 'humidity' | null;
}

const FridgeAlertStateSchema = new Schema<IFridgeAlertState>({
    fridgeID: { type: Schema.Types.ObjectId, ref: "Refrigerators", required: true, unique: true },
    alertActive: { type: Boolean, default: false },
    parameter: { type: String, enum: ['temperature', 'humidity', null], default: null },
    lastNotifiedAt: { type: Date },
});


export const FridgeAlertState = model<IFridgeAlertState>("fridgealertstate", FridgeAlertStateSchema);