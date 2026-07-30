import { Schema, Types, model, HydratedDocument } from 'mongoose';

export interface IVideo {
    title: string;
    description?: string;
    videoUrl: string;
    thumbnail?: string;
    owner: Types.ObjectId;
    genre?: string;
    views: number;
    isPublished: boolean;
}

export type VideoDocument = HydratedDocument<IVideo>;

const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: '',
        },
        videoUrl: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            default: '',
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        genre: {
            type: String,
            trim: true,
            default: '',
        },
        views: {
            type: Number,
            default: 0,
            min: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default model<IVideo>('Video', videoSchema);
