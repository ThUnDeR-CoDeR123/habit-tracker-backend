import express from "express";
import { register, login } from "../controller/authController";
import { authLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { validateRegister, validateLogin } from "../models/dto/auth.dto";
const router = express.Router();

router.post("/register", validate(validateRegister), register);
router.post("/login", authLimiter, validate(validateLogin), login);

export default router;
