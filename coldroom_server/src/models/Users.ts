import { Schema, model, Types } from 'mongoose';

export interface User {
    name: string;
    password: string;
    email: string;
    sendNotification?: boolean,
    phoneNumber?: string;
    role: "Admin" | "Viewer" | "User";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<User>(
    {
        name: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, required: true },
        phoneNumber: { type: String, required: false },
        sendNotification: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

const User = model<User>('currentusers', userSchema);

export default User;
