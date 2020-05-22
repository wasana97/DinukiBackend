import { Request, Response } from "express";

import Sales, { ISales } from "../models/sales";
import Prefix, { IPrefix } from "../models/Prefix";
// import {clearEmpties, removeEmpty } from '../libs/helper'

interface PaginationInfo {
  pages: number;
  pageSize: number;
  items: number;
  currentPage: number;
}

export interface IFilterOptions {
  limit: number;
  skip: number;
  sortBy: string;
  cashierId: string;
  date: Date;
  salesPersonId: string;
}
export interface ISelectFilterOptions {
  cashierId: string;
  date: Date;
  salesPersonId: string;
}

export const removeEmpty = (obj: any) => {
  Object.entries(obj).forEach(
    ([key, val]) =>
      (val && typeof val === "object" && removeEmpty(val)) ||
      ((val === null || val === "") && delete obj[key])
  );
  return obj;
};

export const clearEmpties = (obj: any) => {
  const object = Object.assign({}, obj);
  for (const k in object) {
    if (!object[k] || typeof object[k] !== "object") {
      continue;
    }

    clearEmpties(object[k]);
    if (Object.keys(object[k]).length === 0) {
      delete object[k];
    }
  }
  return object;
};

const getFilters = (filterOptions: IFilterOptions): ISelectFilterOptions =>
  clearEmpties(
    removeEmpty({
      cashierId: filterOptions.cashierId ? filterOptions.cashierId : null,
      salesPersonId: filterOptions.salesPersonId
        ? filterOptions.salesPersonId
        : null,
      date: filterOptions.date ? { $eq: new Date(filterOptions.date) } : null,
    })
  );

export const getNewSalesCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const prefixes = await Prefix.find();
    console.log(prefixes);
    let number = prefixes[0].nextSalesCode;
    const result = await Prefix.findOneAndUpdate(
      { _id: prefixes[0]._id },
      {
        $set: {
          nextSalesCode: number + 1,
        },
      }
    );
    const UpdatedPrefixes = await Prefix.find();
    if (result) {
      let formattedNumber = "00000" + UpdatedPrefixes[0].nextSalesCode;
      formattedNumber = "SO" + formattedNumber.slice(-6);
      return res.status(200).json({
        success: true,
        orderNumber: formattedNumber,
      });
    }

    return res.status(400).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: "Could not get new Sales Code",
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

export const getAllSales = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    const sortBy = "-updatedAt";

    let filterOptions: IFilterOptions = {
      limit: limit,
      skip: skip,
      sortBy: sortBy,
      cashierId: req.query.cashierId,
      date: req.query.date,
      salesPersonId: req.query.salesPersonId,
    };
    const constantFilters = getFilters(filterOptions);

    const salesCount = await Sales.countDocuments({ ...constantFilters });
    const sales = await Sales.find({
      ...constantFilters,
    })
      .limit(limit)
      .skip(skip);

    let item: any;

    let paginationInfo: PaginationInfo = {
      pages: Math.ceil(salesCount / pageSize),
      pageSize: pageSize,
      items: salesCount,
      currentPage: page,
    };

    item = sales;
    return res.status(400).json({
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

export const getSales = async (req: Request, res: Response): Promise<any> => {
  try {
    const sales = await Sales.findOne({ saleId: req.params.saleId });
    if (sales === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Sales not found or Invalid Sales Code",
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: sales,
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

export const createOrUpdateSales = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const salesExists = await Sales.findOne({ saleId: req.body.saleId });
    if (salesExists)
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Sales already exists",
        },
      });
    const newSales: ISales = new Sales(req.body);
    const result = await newSales.save();
    if (result === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Sales not be inserted",
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

export const deleteSaleOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const sale = await Sales.findOneAndDelete({
      saleId: req.params.saleId,
    });
    if (sale === null) {
      return res.status(400).json({
        success: true,
        data: {
          errorCode: 400,
          errorMessage: "Sale could not be found",
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
