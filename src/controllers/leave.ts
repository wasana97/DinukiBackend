import { Request, Response } from "express";

import Leave, { ILeave } from "../models/leave";

interface PaginationInfo {
  pages: number;
  pageSize: number;
  items: number;
  currentPage: number;
}

export const getAllLeaves = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    const sortBy = "-updatedAt";
    const leaveCount = await Leave.countDocuments({
      employeeId: req.query.employeeId,
      from: { $gt: new Date(req.query.from) },
      to: { $lt: new Date(req.query.to) },
    });
    const leave = await Leave.find({
      employeeId: req.query.employeeId,
      from: { $gt: new Date(req.query.from) },
      to: { $lt: new Date(req.query.to) },
    })
      .limit(limit)
      .skip(skip);

    let item: any;

    let paginationInfo: PaginationInfo = {
      pages: Math.ceil(leaveCount / pageSize),
      pageSize: pageSize,
      items: leaveCount,
      currentPage: page,
    };

    item = leave;
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

export const createOrUpdateLeave = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const newLeave: ILeave = new Leave(req.body);
    const result = await newLeave.save();
    if (result === null) {
      return res.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Leave could not be inserted",
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

export const deleteLeave = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const leave = await Leave.findOneAndDelete({
      _id: req.params._id,
    });
    if (leave === null) {
      return res.status(400).json({
        success: true,
        data: {
          errorCode: 400,
          errorMessage: "Leave could not be found",
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
