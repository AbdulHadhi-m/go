import asyncHandler from "../utils/asyncHandler.js";
import RewardTransaction from "../models/rewardTransactionModel.js";
import User from "../models/userModel.js";
import { calculateRedeemableCoins } from "../utils/rewardUtils.js";

// @desc    Get user reward balance
// @route   GET /api/rewards/balance
// @access  Private
export const getRewardBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    coins: user.rewardCoins || 0,
  });
});

// @desc    Get user reward history
// @route   GET /api/rewards/history
// @access  Private
export const getRewardHistory = asyncHandler(async (req, res) => {
  const history = await RewardTransaction.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("booking", "trip seats totalAmount createdAt");

  res.status(200).json({
    success: true,
    count: history.length,
    history,
  });
});

// @desc    Get redemption preview
// @route   POST /api/rewards/redeem-preview
// @access  Private
export const getRedeemPreview = asyncHandler(async (req, res) => {
  const { totalAmount } = req.body;

  if (!totalAmount || totalAmount <= 0) {
    res.status(400);
    throw new Error("Invalid booking amount");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const userCoins = user.rewardCoins || 0;
  const maxRedeemable = calculateRedeemableCoins(userCoins, totalAmount);
  const discountValue = maxRedeemable * 0.50;

  res.status(200).json({
    success: true,
    userCoins,
    maxRedeemable,
    finalAmount: totalAmount - discountValue,
    exchangeRate: 0.50, // 1 coin = 0.50 unit currency
  });
});
