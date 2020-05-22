import { Schema, model, Document } from "mongoose";

export interface IPrefix extends Document {
  productPrefix: string;
  nextProductCode: number;
  supplierPrefix: string;
  nextSupplierCode: number;
  employeePrefix: string;
  nextEmployeeCode: number;
  salesPrefix: string;
  nextSalesCode: number;
  customerReturnPrefix: string;
  nextCustomerReturnCode: number;
  ordersPrefix: string;
  nextOrderId: number;
}

const prefixSchema = new Schema(
  {
    productPrefix: {
      type: String,
    },
    nextProductCode: {
      type: Number,
      required: true,
    },
    supplierPrefix: {
      type: String,
    },
    nextSupplierCode: {
      type: Number,
      required: true,
    },
    employeePrefix: {
      type: String,
    },
    nextEmployeeCode: {
      type: Number,
      required: true,
    },
    salesPrefix: {
      type: String,
      required: true,
    },
    nextSalesCode: {
      type: Number,
    },
    customerReturnPrefix: {
      type: String,
    },
    nextCustomerReturnCode: {
      type: Number,
      required: true,
    },
    ordersPrefix: { type: String },
    nextOrderId: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<IPrefix>("Prefix", prefixSchema);
