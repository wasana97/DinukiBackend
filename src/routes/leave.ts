import { Router } from "express";
const router = Router();

import { TokenValidation } from "../libs/verifyToken";
import {
  createOrUpdateLeave,
  getAllLeaves,
  deleteLeave,
} from "../controllers/leave";

router.post("/", TokenValidation, createOrUpdateLeave);
router.get("/", TokenValidation, getAllLeaves);
router.delete("/:_id", TokenValidation, deleteLeave);

export default router;
