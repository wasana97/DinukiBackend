import { Schema, model, Document } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  supplierCode: string;
  productCode: string;
  productName: string;
  size: number;
  price: number;
  color: string;
  quantity: number;
}

const ordersSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
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
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IOrder>("Orders", ordersSchema);
