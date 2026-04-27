import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";

const safeUserResponse = (user, token) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName || "",
  email: user.email,
  phone: user.phone || "",
  avatar: user.avatar || "",
  rewardCoins: user.rewardCoins || 0,
  role: user.role,
  ...(token ? { token } : {}),
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const tripCount = await Booking.countDocuments({ user: req.user._id, bookingStatus: "completed" });

  res.status(200).json({
    success: true,
    user: {
      ...safeUserResponse(user, req.user.token),
      tripCount,
    },
  });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, avatar, password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: user._id },
    });
    if (existingUser) {
      res.status(400);
      throw new Error("Email is already in use");
    }
    user.email = email.toLowerCase().trim();
  }

  if (firstName !== undefined) user.firstName = String(firstName).trim();
  if (lastName !== undefined) user.lastName = String(lastName).trim();
  if (phone !== undefined) user.phone = String(phone).trim();
  if (avatar !== undefined) user.avatar = String(avatar).trim();

  if (password) {
    if (String(password).length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  const refreshed = await User.findById(user._id).select("-password");
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: safeUserResponse(refreshed, req.user.token),
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current password and new password are required");
  }

  if (String(newPassword).length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.password) {
    res.status(400);
    throw new Error("Password change is not available for this account");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please select an image file to upload");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }


  // Cloudinary returns the uploaded image URL in req.file.path
  user.avatar = req.file.path || req.file.secure_url;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    user: safeUserResponse(user, req.user.token),
  });
});
