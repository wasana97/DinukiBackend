import { Request, Response } from "express";

import Orders, { IOrder } from "../models/orders";
import Prefix, { IPrefix } from "../models/Prefix";

interface PaginationInfo {
  pages: number;
  pageSize: number;
  items: number;
  currentPage: number;
}

export const getNewOrdersId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const prefixes = await Prefix.find();
    console.log(prefixes);
    let number = prefixes[0].nextOrderId;
    const result = await Prefix.findOneAndUpdate(
      { _id: prefixes[0]._id },
      {
        $set: {
          nextOrderId: number + 1,
        },
      }
    );
    const UpdatedPrefixes = await Prefix.find();
    if (result) {
      let formattedNumber = "00000" + UpdatedPrefixes[0].nextOrderId;
      formattedNumber = "OD" + formattedNumber.slice(-6);
      return res.status(200).json({
        success: true,
        orderNumber: formattedNumber,
      });
    }

    return res.status(400).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: "Could not get new order Id",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: error.errorMessage,
      },
    });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    const sortBy = "-updatedAt";
    const ordersCount = await Orders.countDocuments();
    const orders = await Orders.find().limit(limit).skip(skip);

    let item: any;

    let paginationInfo: PaginationInfo = {
      pages: Math.ceil(ordersCount / pageSize),
      pageSize: pageSize,
      items: ordersCount,
      currentPage: page,
    };

    item = orders;
    return res.status(200).json({
      success: true,
      data: {
        paginationInfo,
        item,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: error,
      },
    });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const order = await Orders.findOne({
      orderId: req.params.orderId,
    });
    if (order === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Order not found or Invalid Order Id",
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: order,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: error,
      },
    });
  }
};

export const createOrUpdateOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const orderExists = await Orders.findOne({
      orderId: req.body.orderId,
    });
    if (orderExists)
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Order already exists",
        },
      });
    const newOrder: IOrder = new Orders(req.body);
    const result = await newOrder.save();
    if (result === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Order cannot be inserted",
        },
      });
    } else {
      return res.status(201).json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: error,
      },
    });
  }
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const order = await Orders.findOneAndUpdate(
      { orderId: req.body.orderId },
      req.body
    );
    if (order === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Order could not be found",
        },
      });
    } else {
      const updatedOrder = { orderId: req.body.orderId, ...req.body };
      res.status(200).json({ success: true, data: updatedOrder });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: error,
      },
    });
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const order = await Orders.findOneAndDelete({
      orderId: req.params.orderId,
    });
    if (order === null) {
      return res.status(400).json({
        success: true,
        data: {
          errorCode: 400,
          errorMessage: "Order could not be found",
        },
      });
    } else {
      return res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: error,
      },
    });
  }
};
