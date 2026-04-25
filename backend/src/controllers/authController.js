import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { createAndSendNotification } from "../services/notificationService.js";
import Joi from "joi";

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (!user) {
    res.status(400);
    throw new Error("Failed to register user");
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  // Trigger Welcome Notification
  await createAndSendNotification({
    user: user._id,
    title: 'Welcome to GoPath!',
    message: `Hi ${firstName}, welcome to GoPath. Start booking your premium journeys today!`,
    category: 'account',
    deliveryChannels: ['in-app', 'email'],
    emailData: {
      to: user.email,
      templateType: 'generic',
    }
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
      role: user.role,
      token,
    },
  });
});

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error("Your account is blocked");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  // Trigger Security Alert
  await createAndSendNotification({
    user: user._id,
    title: 'New Login Detected',
    message: 'We noticed a new login to your GoPath account. If this wasn\'t you, secure your account.',
    category: 'account',
    deliveryChannels: ['in-app', 'email'],
    emailData: {
      to: user.email,
      templateType: 'security_alert',
      data: { deviceInfo: req.headers['user-agent'] || 'Unknown Device' }
    }
  });

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
      role: user.role,
      token,
    },
  });
});

// @desc Logout user
// @route POST /api/auth/logout
// @access Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc Get current user
// @route GET /api/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// @desc Google auth success
// @route GET /api/auth/google/callback
// @access Public
export const googleAuthSuccess = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  setTokenCookie(res, token);

  const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";

  res.redirect(
    `${frontendUrl}/login-success?token=${token}&email=${encodeURIComponent(
      req.user.email
    )}&firstName=${encodeURIComponent(req.user.firstName || "")}&lastName=${encodeURIComponent(req.user.lastName || "")}`
  );
});

// @desc Google auth failure
// @route GET /api/auth/google/failure
// @access Public
export const googleAuthFailure = asyncHandler(async (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});