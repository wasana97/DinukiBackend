import { Router } from "express";
const router = Router();

import { TokenValidation } from "../libs/verifyToken";
import {
  getNewOrdersId,
  getAllOrders,
  deleteOrder,
  createOrUpdateOrder,
  updateOrder,
  getOrder,
} from "../controllers/orders";

router.get("/newOrderId", TokenValidation, getNewOrdersId);
router.post("/", TokenValidation, createOrUpdateOrder);
router.put("/", TokenValidation, updateOrder);
router.get("/", TokenValidation, getAllOrders);
router.get("/:orderId", TokenValidation, getOrder);
router.delete("/:orderId", TokenValidation, deleteOrder);

export default router;
