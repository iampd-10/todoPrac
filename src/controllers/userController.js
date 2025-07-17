import userSchema from "../model/userSchema.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {verifyEmail} from '../emailVerify/verifyEmail.js';
dotenv.config();
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existing = await userSchema.findOne({ email: email });
    if (existing) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      userName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "5m",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: { userName: userName },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid  password",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "5m",
    });

    // Optionally update token field if you store it in DB
    user.token = token;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userName: user.userName,
        token: token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

