import { Schema, Types, model, HydratedDocument } from 'mongoose';

export interface IReport {
    video: Types.ObjectId;
    reportedBy: Types.ObjectId;
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
}

export type ReportDocument = HydratedDocument<IReport>;

const reportSchema = new Schema<IReport>(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true,
        },
        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: ['pending', 'resolved', 'dismissed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

reportSchema.index({ video: 1, reportedBy: 1 }, { unique: true });

export default model<IReport>('Report', reportSchema);
