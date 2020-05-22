import { Request, Response } from "express";

import Supplier, { ISupplier } from "../models/supplier";
import Prefix, { IPrefix } from "../models/Prefix";

interface PaginationInfo {
  pages: number;
  pageSize: number;
  items: number;
  currentPage: number;
}

export const getNewSupplierCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const prefixes = await Prefix.find();
    console.log(prefixes);
    let number = prefixes[0].nextSupplierCode;
    const result = await Prefix.findOneAndUpdate(
      { _id: prefixes[0]._id },
      {
        $set: {
          nextSupplierCode: number + 1,
        },
      }
    );
    const UpdatedPrefixes = await Prefix.find();
    if (result) {
      let formattedNumber = "00000" + UpdatedPrefixes[0].nextSupplierCode;
      formattedNumber = "SU" + formattedNumber.slice(-6);
      return res.status(200).json({
        success: true,
        orderNumber: formattedNumber,
      });
    }

    return res.status(400).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: "Could not get new Supplier Code",
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

export const getAllSuppliers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    const sortBy = "-updatedAt";
    const supplierCount = await Supplier.countDocuments();
    const suppliers = await Supplier.find().limit(limit).skip(skip);

    let item: any;

    let paginationInfo: PaginationInfo = {
      pages: Math.ceil(supplierCount / pageSize),
      pageSize: pageSize,
      items: supplierCount,
      currentPage: page,
    };

    item = suppliers;
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

export const getSupplier = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const supplier = await Supplier.findOne({
      supplierCode: req.params.supplierCode,
    });
    if (supplier === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Supplier not found or Invalid Supplier Code",
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: supplier,
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

export const createOrUpdateSupplier = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const supplierExists = await Supplier.findOne({
      supplierCode: req.body.supplierCode,
    });
    if (supplierExists)
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Supplier already exists",
        },
      });
    const newSupplier: ISupplier = new Supplier(req.body);
    const result = await newSupplier.save();
    if (result === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Supplier not be inserted",
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

export const updateSupplier = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { supplierCode: req.body.supplierCode },
      req.body
    );
    if (supplier === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Supplier could not be found",
        },
      });
    } else {
      const updatedSupplier = {
        supplierCode: req.body.supplierCode,
        ...req.body,
      };
      res.status(200).json({ success: true, data: updatedSupplier });
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

export const deleteSupplier = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const supplier = await Supplier.findOneAndDelete({
      supplierCode: req.params.supplierCode,
    });
    if (supplier === null) {
      return res.status(400).json({
        success: true,
        data: {
          errorCode: 400,
          errorMessage: "Supplier could not be found",
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
