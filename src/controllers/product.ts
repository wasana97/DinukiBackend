import { Request, Response } from "express";

import Product, { IProduct } from "../models/Product";
import Prefix, { IPrefix } from "../models/Prefix";

interface PaginationInfo {
  pages: number;
  pageSize: number;
  items: number;
  currentPage: number;
}

export const getNewProductCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const prefixes = await Prefix.find();
    console.log(prefixes);
    let number = prefixes[0].nextProductCode;
    const result = await Prefix.findOneAndUpdate(
      { _id: prefixes[0]._id },
      {
        $set: {
          nextProductCode: number + 1,
        },
      }
    );
    const UpdatedPrefixes = await Prefix.find();
    if (result) {
      let formattedNumber = "00000" + UpdatedPrefixes[0].nextProductCode;
      formattedNumber = "PO" + formattedNumber.slice(-6);
      return res.status(200).json({
        success: true,
        orderNumber: formattedNumber,
      });
    }

    return res.status(400).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: "Could not get new Product Code",
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

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    const sortBy = "-updatedAt";
    const productCount = await Product.countDocuments();
    const products = await Product.find().limit(limit).skip(skip);

    let item: any;

    let paginationInfo: PaginationInfo = {
      pages: Math.ceil(productCount / pageSize),
      pageSize: pageSize,
      items: productCount,
      currentPage: page,
    };

    item = products;
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

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findOne({
      productCode: req.params.productCode,
    });
    if (product === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Product not found or Invalid Product Code",
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: product,
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

export const createOrUpdateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userExists = await Product.findOne({
      productCode: req.body.productCode,
    });
    if (userExists)
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Product already exists",
        },
      });
    const newProduct: IProduct = new Product(req.body);
    const result = await newProduct.save();
    if (result === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Product not be inserted",
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

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const product = await Product.findOneAndUpdate(
      { productCode: req.body.productCode },
      req.body
    );
    if (product === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Product could not be found",
        },
      });
    } else {
      const updatedProduct = { productCode: req.body.productCode, ...req.body };
      res.status(200).json({ success: true, data: updatedProduct });
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

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const product = await Product.findOneAndDelete({
      productCode: req.params.productCode,
    });
    if (product === null) {
      return res.status(400).json({
        success: true,
        data: {
          errorCode: 400,
          errorMessage: "Product could not be found",
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
