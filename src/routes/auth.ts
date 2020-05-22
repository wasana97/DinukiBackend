import { Router } from "express";
const router = Router();

import {
  signUp,
  signIn,
  profile,
  updateProfile,
  getAllProfiles,
  deleteUser,
  getUser,
} from "../controllers/auth";
import { TokenValidation } from "../libs/verifyToken";

router.post("/register", signUp);
router.post("/login", signIn);
router.get("/profile", TokenValidation, profile);
router.get("/profile/user/:userId", TokenValidation, getUser);
router.put("/profile", TokenValidation, updateProfile);
router.get("/profile/all", TokenValidation, getAllProfiles);
router.delete("/profile/:userId", TokenValidation, deleteUser);

export default router;
