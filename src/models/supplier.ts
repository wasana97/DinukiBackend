import { Schema, model, Document } from 'mongoose'

export interface ISupplier extends Document {
    supplierCode: string,
	supplierName: string,
	contactNumber: string,
	address: string

};

const productSchema = new Schema({
    supplierCode: {
        type: String,
        required: true,
    },
    supplierName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

export default model<ISupplier>('Supplier', productSchema);