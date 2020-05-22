import { Schema, model, Document } from 'mongoose'

export interface ILeave extends Document {
    employeeId: string,
	leaveType: string,
	reason: string,
	from : Date,
	to: Date
};

const leaveSchema = new Schema({
    employeeId: {
        type: String,
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
});

export default model<ILeave>('Leave', leaveSchema);