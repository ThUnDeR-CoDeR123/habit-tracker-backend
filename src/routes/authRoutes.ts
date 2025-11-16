import express from "express";
import { register, login } from "../controller/authController";
import { authLimiter } from "../middleware/rateLimiter";
const router = express.Router();

router.post("/register", register); 
router.post("/login", authLimiter, login);  

export default router;
