import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

export const getAllOperators = asyncHandler(async (req, res) => {
  const operators = await User.find({
    $or: [{ role: "operator" }, { operatorApplicationStatus: "pending" }],
  })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, operators });
});

export const approveOperator = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = "operator";
  user.operatorApplicationStatus = "approved";
  user.operatorApplicationNote = "Approved by admin";
  user.isBlocked = false;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Operator approved",
    user,
  });
});

export const rejectOperator = asyncHandler(async (req, res) => {
  const { reason = "Rejected by admin" } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = "user";
  user.operatorApplicationStatus = "rejected";
  user.operatorApplicationNote = reason;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Operator request rejected",
    user,
  });
});