import { Request, Response } from "express";
import User from "../schemas/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IRequest } from "../middlewares/authMiddleware";
import { getUserDTO } from "../utils/dtoUtils";
import { JWT_SECRET } from "../config";

export const register = async (req: Request, res: Response) => {
  const { name, phone, dateOfBirth, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName: name,
      email,
      phone,
      dateOfBirth,
      role: "user",
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, user: getUserDTO(user) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const authenticate = async (req: IRequest, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ ...getUserDTO(user), email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
