import { Request, Response } from 'express'

import Salary, { ISalary } from '../models/salary'

interface PaginationInfo {
    pages: number;
    pageSize: number,
    items: number,
    currentPage: number,
};

export const getAllSalary = async(req: Request, res: Response): Promise<any> =>   {
    
    try {

        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const limit = pageSize;
        const skip = (page - 1) * pageSize;
        const sortBy = "-updatedAt";
        const salaryCount = await Salary.countDocuments({employeeId: req.query.employeeId});
        const salary = await Salary.find({employeeId: req.query.employeeId}).limit(limit).skip(skip);
        
        let item: any;

        let paginationInfo: PaginationInfo = {
            pages : Math.ceil(salaryCount / pageSize),
            pageSize: pageSize,
            items: salaryCount,
            currentPage: page,
        };
        
        item = salary;
        return res.status(400).json({
            success: true, 
            data: {
                paginationInfo,
                item
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {
                errorCode: 500,
                errorMessage: error
            }
        });
    }
}

export const createOrUpdateSalary = async(req: Request, res: Response): Promise<any> =>  {
    try {
        const newSalary: ISalary = new Salary(req.body);
        const result = await newSalary.save();
        if (result === null) {
            return res.status(400).json({
                success: false,
                data: {
                    errorCode: 400,
                    errorMessage: 'Salary could not be inserted'
                }
            });
        } else {
            return res.status(201).json({ 
                success: true,
                data: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {
                errorCode: 500,
                errorMessage: error
            }
        })
    }
}