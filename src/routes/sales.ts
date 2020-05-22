import { Router } from "express";
const router = Router();

import { TokenValidation } from "../libs/verifyToken";
import {
  createOrUpdateSales,
  getSales,
  getAllSales,
  getNewSalesCode,
  deleteSaleOrder,
} from "../controllers/sales";

router.get("/newSalesId", TokenValidation, getNewSalesCode);
router.post("/", TokenValidation, createOrUpdateSales);
router.get("/", TokenValidation, getAllSales);
router.get("/:saleId", TokenValidation, getSales);
router.delete("/:saleId", TokenValidation, deleteSaleOrder);

export default router;
