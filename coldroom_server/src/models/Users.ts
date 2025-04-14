import { Schema, model, Types } from 'mongoose';

export interface User {
    name: string;
    password: string;
    email: string;
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
    },
    {
        timestamps: true,
    }
);

const User = model<User>('currentusers', userSchema);

export default User;
