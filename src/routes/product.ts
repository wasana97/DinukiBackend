import { Router } from 'express';
const router = Router();

import { TokenValidation } from '../libs/verifyToken'
import { createOrUpdateProduct, getProduct, deleteProduct, getAllProducts, updateProduct, getNewProductCode } from '../controllers/product';

router.get('/newProductCode', TokenValidation, getNewProductCode)
router.post('/', TokenValidation, createOrUpdateProduct)
router.put('/', TokenValidation, updateProduct)
router.get('/', TokenValidation, getAllProducts)
router.get('/:productCode', TokenValidation, getProduct)
router.delete('/:productCode', TokenValidation, deleteProduct)

export default router;
