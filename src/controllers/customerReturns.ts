import { Request, Response } from "express";

import CustomerReturn, { ICustomerReturn } from "../models/customerReturn";
import Prefix, { IPrefix } from "../models/Prefix";

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
  reason: string;
}
export interface ISelectFilterOptions {
  cashierId: string;
  date: Date;
  reason: string;
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
      date: filterOptions.date ? { $eq: new Date(filterOptions.date) } : null,
      reason: filterOptions.reason ? filterOptions.reason : null,
    })
  );

export const getNewCustomerReturnCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const prefixes = await Prefix.find();
    console.log(prefixes);
    let number = prefixes[0].nextCustomerReturnCode;
    const result = await Prefix.findOneAndUpdate(
      { _id: prefixes[0]._id },
      {
        $set: {
          nextCustomerReturnCode: number + 1,
        },
      }
    );
    const UpdatedPrefixes = await Prefix.find();
    if (result) {
      let formattedNumber = "00000" + UpdatedPrefixes[0].nextCustomerReturnCode;
      formattedNumber = "CR" + formattedNumber.slice(-6);
      return res.status(200).json({
        success: true,
        returnId: formattedNumber,
      });
    }

    return res.status(400).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: "Could not get new CustomerReturn Code",
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

export const getAllCustomerReturn = async (
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
      reason: req.query.reason,
    };
    const constantFilters = getFilters(filterOptions);

    const customerReturnCount = await CustomerReturn.countDocuments({
      ...constantFilters,
    });
    const customerReturn = await CustomerReturn.find({
      ...constantFilters,
    })
      .limit(limit)
      .skip(skip);

    let item: any;

    let paginationInfo: PaginationInfo = {
      pages: Math.ceil(customerReturnCount / pageSize),
      pageSize: pageSize,
      items: customerReturnCount,
      currentPage: page,
    };

    item = customerReturn;
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

export const createOrUpdateCustomerReturn = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const customerReturnExists = await CustomerReturn.findOne({
      returnId: req.body.returnId,
    });
    if (customerReturnExists)
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "CustomerReturn already exists",
        },
      });
    const newCustomerReturn: ICustomerReturn = new CustomerReturn(req.body);
    const result = await newCustomerReturn.save();
    if (result === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "CustomerReturn could not be inserted",
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

export const deleteCustomerReturn = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const customerReturn = await CustomerReturn.findOneAndDelete({
      returnId: req.params.returnId,
    });
    if (customerReturn === null) {
      return res.status(400).json({
        success: true,
        data: {
          errorCode: 400,
          errorMessage: "Customer sale could not be found",
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

export const getCustomerReturn = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const customerReturn = await CustomerReturn.findOne({
      returnId: req.params.returnId,
    });
    if (customerReturn === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Return not found or Invalid return Id",
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: customerReturn,
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

export const updateCustomerReturn = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const customerReturn = await CustomerReturn.findOneAndUpdate(
      { returnId: req.body.returnId },
      req.body
    );

    if (customerReturn === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Return could not be found",
        },
      });
    } else {
      const updatedReturn = { returnId: req.body.returnId, ...req.body };
      res.status(200).json({ success: true, data: updatedReturn });
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
