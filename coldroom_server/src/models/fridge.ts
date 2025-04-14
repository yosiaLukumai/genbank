import mongoose, { Schema, Document } from 'mongoose';

interface IRefrigerator extends Document {
    name: string;
    capacity: number;
    humiditymax?: number;
    tempmax?: number;
    refrigerator_type?: string;
}

const refrigeratorSchema: Schema = new Schema<IRefrigerator>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    humiditymax: {
        type: Number,
    },
    tempmax: {
        type: Number,
    },
    refrigerator_type: {
        type: String,
    },

});

const Refrigerator = mongoose.model<IRefrigerator>('Refrigerators', refrigeratorSchema);

export default Refrigerator;


