import { Router } from 'express';
const router = Router();

import { TokenValidation } from '../libs/verifyToken'
import { createOrUpdateSalary, getAllSalary } from '../controllers/salary';

router.post('/', TokenValidation, createOrUpdateSalary)
router.get('/', TokenValidation, getAllSalary)

export default router;
