import { Request, Response } from "express";

import Employee, { IEmployee } from "../models/Employee";
import Prefix, { IPrefix } from "../models/Prefix";

interface PaginationInfo {
  pages: number;
  pageSize: number;
  items: number;
  currentPage: number;
}

export const getNewEmployeeCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const prefixes = await Prefix.find();
    console.log(prefixes);
    let number = prefixes[0].nextEmployeeCode;
    const result = await Prefix.findOneAndUpdate(
      { _id: prefixes[0]._id },
      {
        $set: {
          nextEmployeeCode: number + 1,
        },
      }
    );
    const UpdatedPrefixes = await Prefix.find();
    if (result) {
      let formattedNumber = "00000" + UpdatedPrefixes[0].nextEmployeeCode;
      formattedNumber = "EMP" + formattedNumber.slice(-6);
      return res.status(200).json({
        success: true,
        employeeId: formattedNumber,
      });
    }

    return res.status(400).json({
      success: false,
      data: {
        errorCode: 500,
        errorMessage: "Could not get new Employee Code",
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

export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    const sortBy = "-updatedAt";
    const employeeCount = await Employee.countDocuments();
    const employees = await Employee.find().limit(limit).skip(skip);

    let item: any;

    let paginationInfo: PaginationInfo = {
      pages: Math.ceil(employeeCount / pageSize),
      pageSize: pageSize,
      items: employeeCount,
      currentPage: page,
    };

    item = employees;
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

export const getEmployee = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId,
    });
    if (employee === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Employee not found or Invalid Employee Code",
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: employee,
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

export const createOrUpdateEmployee = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userExists = await Employee.findOne({
      employeeId: req.body.employeeId,
    });
    if (userExists)
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Employee already exists",
        },
      });
    const newEmployee: IEmployee = new Employee(req.body);
    const result = await newEmployee.save();
    if (result === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Employee not be inserted",
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

export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.body.employeeId },
      req.body
    );
    if (employee === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Employee could not be found",
        },
      });
    } else {
      const updatedEmployee = { employeeId: req.body.employeeId, ...req.body };
      res.status(200).json({ success: true, data: updatedEmployee });
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

export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const employee = await Employee.findOneAndDelete({
      employeeId: req.params.employeeId,
    });
    if (employee === null) {
      return res.status(400).json({
        success: true,
        data: {
          errorCode: 400,
          errorMessage: "Employee could not be found",
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
