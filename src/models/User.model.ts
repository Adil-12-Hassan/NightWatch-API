import { Schema, model, HydratedDocument } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    role: 'user' | 'admin';
    isBanned: boolean;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default model<IUser>('User', userSchema);
