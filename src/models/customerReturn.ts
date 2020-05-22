import { Schema, model, Document } from "mongoose";

export interface ICustomerReturn extends Document {
  returnId: string;
  productCode: string;
  ProductName: string;
  color: string;
  size: string;
  date: Date;
  reason: string;
  cashierId: string;
  quantity: string;
}

const customerReturnSchema = new Schema(
  {
    returnId: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    ProductName: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    cashierId: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ICustomerReturn>("CustomerReturn", customerReturnSchema);
