import { Schema, model, Document } from 'mongoose'

export interface IProduct extends Document {
    productCode: string,
	productName: string,
	supplierCode: string,
	size: number,
	price: number,
	color: string,
	quantity: number,
	storeLocation: string,
	margin: number
};

const productSchema = new Schema({
    productCode: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    supplierCode: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    storeLocation: {
        type: String,
        required: true
    },
    margin: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
});

export default model<IProduct>('Product', productSchema);