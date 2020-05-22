import { Schema, model, Document } from 'mongoose'

export interface IEmployee extends Document {
    employeeId: string,
	employeeName: string,
	employeeType: string,
	contactNumber: string,
	address: string,
	nic: string,
	email: string,
	salaryPerMonth: number
};

const employeeSchema = new Schema({
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
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    salaryPerMonth: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
});

export default model<IEmployee>('Employee', employeeSchema);