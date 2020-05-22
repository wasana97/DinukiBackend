import { Schema, model, Document } from 'mongoose'

export interface ISalary extends Document {
    employeeId: string,
	employeeName: string,
	employeeType: string,
	basicSalary: number,
	bonus: number,
	from: Date,
	to: Date,
	netSalary: number


};

const salarySchema = new Schema({
    employeeId: {
        type: String,
        required: true,
    },
    employeeName: {
        type: String,
        required: true,
    },
    employeeType: {
        type: String,
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number,
        required: true
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
        required: true,
    },
    netSalary: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
});

export default model<ISalary>('Salary', salarySchema);