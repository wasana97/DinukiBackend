import { Router } from 'express';
const router = Router();

import { TokenValidation } from '../libs/verifyToken'
import { createOrUpdateEmployee, getEmployee, deleteEmployee, getAllEmployees, updateEmployee, getNewEmployeeCode } from '../controllers/employee';

router.get('/newEmployeeId', TokenValidation, getNewEmployeeCode)
router.post('/', TokenValidation, createOrUpdateEmployee)
router.put('/', TokenValidation, updateEmployee)
router.get('/', TokenValidation, getAllEmployees)
router.get('/:employeeId', TokenValidation, getEmployee)
router.delete('/:employeeId', TokenValidation, deleteEmployee)

export default router;
