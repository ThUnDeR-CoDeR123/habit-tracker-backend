import express from "express";
import { register, login } from "../controller/authController";
import { authLimiter } from "../middleware/rateLimiter";
const router = express.Router();

router.post("/register", register); // Usually safe & low usage
router.post("/login", authLimiter, login);   // rate-limited login

export default router;
