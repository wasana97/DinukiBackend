import { Schema, model, Document } from 'mongoose'

export interface ISales extends Document {
    saleId: string,
	date: Date,
	time: Date,
	total: number,
	cashierId: string,
	salesPersonId: string,
	products: Array<any>

};

const salesSchema = new Schema({
    saleId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
    cashierId: {
        type: String,
        required: true
    },
    salesPersonId: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    }
}, {
    timestamps: true,
});

export default model<ISales>('Sales', salesSchema);