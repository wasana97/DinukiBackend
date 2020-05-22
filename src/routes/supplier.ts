import { Router } from 'express';
const router = Router();

import { TokenValidation } from '../libs/verifyToken'
import { createOrUpdateSupplier, getSupplier, deleteSupplier, getAllSuppliers, updateSupplier, getNewSupplierCode } from '../controllers/supplier';

router.get('/newSupplierCode', TokenValidation, getNewSupplierCode)
router.post('/', TokenValidation, createOrUpdateSupplier)
router.put('/', TokenValidation, updateSupplier)
router.get('/', TokenValidation, getAllSuppliers)
router.get('/:supplierCode', TokenValidation, getSupplier)
router.delete('/:supplierCode', TokenValidation, deleteSupplier)

export default router;
