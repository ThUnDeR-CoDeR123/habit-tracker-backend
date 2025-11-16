import { Request, Response } from "express";
import prisma from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "some_dev_secret_key"; 

// POST /register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;


    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });


    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, token });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
