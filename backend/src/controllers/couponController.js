import asyncHandler from "express-async-handler";
import dayjs from "dayjs";
import voucherCodeGenerator from "voucher-code-generator";
import mongoose from "mongoose";
import Coupon from "../models/couponModel.js";
import Booking from "../models/bookingModel.js";
import Trip from "../models/tripModel.js";
import CouponUsage from "../models/couponUsageModel.js";

const FIRST_BOOKING_PERCENT = 10;

const normalizeRoute = (val = "") => String(val).trim().toLowerCase();

const isFirstSuccessfulBooking = async (userId) => {
  const count = await Booking.countDocuments({
    user: userId,
    bookingStatus: { $in: ["confirmed", "completed"] },
    paymentStatus: { $in: ["paid", "refunded", "partial_refunded"] },
  });
  return count === 0;
};

const buildAutoOffer = (amount) => {
  const discountAmount = Number(((amount * FIRST_BOOKING_PERCENT) / 100).toFixed(2));
  return {
    offerType: "first_booking_auto",
    offerApplied: "FIRST10",
    couponCode: null,
    discountAmount,
    selectedOfferReason: "First booking 10% auto offer applied",
    offerMeta: {
      percent: FIRST_BOOKING_PERCENT,
    },
  };
};

const buildManualOffer = (coupon, amount) => {
  let discountAmount = 0;

  if (coupon.discountType === "percentage") {
    discountAmount = Number(((amount * coupon.discountValue) / 100).toFixed(2));
    if (coupon.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  discountAmount = Math.min(amount, Math.max(0, discountAmount));

  return {
    offerType: "coupon",
    offerApplied: coupon.code,
    couponCode: coupon.code,
    discountAmount,
    selectedOfferReason: "Manual coupon applied",
    offerMeta: {
      couponId: coupon._id,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      festivalTag: coupon.festivalTag || "",
    },
  };
};

const checkCouponEligibility = async ({ coupon, amount, trip, userId }) => {
  if (!coupon) return "Invalid coupon code";
  if (!coupon.isActive) return "Coupon is inactive";
  if (dayjs(coupon.startDate).isAfter(dayjs())) return "Coupon is not active yet";
  if (dayjs(coupon.expiryDate).isBefore(dayjs())) return "Coupon has expired";
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return "Coupon usage limit reached";
  }

  // Check per-user limit
  const userUsageCount = await CouponUsage.countDocuments({
    user: userId,
    coupon: coupon._id,
  });
  if (userUsageCount >= (coupon.perUserLimit || 1)) {
    return "You have exceeded the usage limit for this coupon";
  }
  if (amount < coupon.minAmount) {
    return `Minimum amount should be ₹${coupon.minAmount} for this coupon`;
  }

  if (coupon.firstTimeUsersOnly) {
    const firstTime = await isFirstSuccessfulBooking(userId);
    if (!firstTime) return "Coupon is valid only for first-time users";
  }

  if (trip && Array.isArray(coupon.applicableRoutes) && coupon.applicableRoutes.length > 0) {
    const from = normalizeRoute(trip.from);
    const to = normalizeRoute(trip.to);
    const routeAllowed = coupon.applicableRoutes.some(
      (route) => normalizeRoute(route.from) === from && normalizeRoute(route.to) === to
    );
    if (!routeAllowed) return "Coupon is not applicable on this route";
  }

  return null;
};

export const evaluateOffer = async ({ userId, amount, code, trip }) => {
  const hasAuto = await isFirstSuccessfulBooking(userId);
  const autoOffer = hasAuto ? buildAutoOffer(amount) : null;

  let manualOffer = null;
  let manualCoupon = null;
  let manualError = null;

  if (code) {
    manualCoupon = await Coupon.findOne({ code: String(code).trim().toUpperCase() });
    manualError = await checkCouponEligibility({
      coupon: manualCoupon,
      amount,
      trip,
      userId,
    });
    if (!manualError) {
      manualOffer = buildManualOffer(manualCoupon, amount);
    }
  }

  let selectedOffer = null;
  if (manualOffer && autoOffer) {
    selectedOffer = manualOffer.discountAmount >= autoOffer.discountAmount ? manualOffer : autoOffer;
    if (selectedOffer.offerType === "coupon") {
      selectedOffer.selectedOfferReason = "Coupon replaced first booking offer";
    } else {
      selectedOffer.selectedOfferReason = "First booking offer gave better discount";
    }
  } else {
    selectedOffer = manualOffer || autoOffer;
  }

  const discountAmount = selectedOffer?.discountAmount || 0;
  const finalAmount = Math.max(0, Number((amount - discountAmount).toFixed(2)));

  return {
    selectedOffer,
    manualError,
    manualCoupon,
    autoOffer,
    finalAmount,
    discountAmount,
  };
};

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, amount, tripId } = req.body;
  const originalAmount = Number(amount);

  if (!originalAmount || originalAmount <= 0) {
    res.status(400);
    throw new Error("Valid amount is required");
  }

  let trip = null;
  if (tripId) {
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      res.status(400);
      throw new Error("Invalid trip id");
    }
    trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }
  }

  const result = await evaluateOffer({
    userId: req.user._id,
    amount: originalAmount,
    code,
    trip,
  });

  if (code && result.manualError && !result.autoOffer) {
    res.status(400);
    throw new Error(result.manualError);
  }

  res.status(200).json({
    success: true,
    originalAmount,
    discountAmount: result.discountAmount,
    finalAmount: result.finalAmount,
    offerType: result.selectedOffer?.offerType || "none",
    offerApplied: result.selectedOffer?.offerApplied || null,
    couponCode: result.selectedOffer?.couponCode || null,
    offerMeta: result.selectedOffer?.offerMeta || {},
    selectedOfferReason:
      result.selectedOffer?.selectedOfferReason ||
      (result.manualError ? `${result.manualError}. No offer applied.` : "No offer applied"),
    firstBookingOfferUsed: result.selectedOffer?.offerType === "first_booking_auto",
  });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const code = String(req.params.code || "").trim().toUpperCase();
  const amount = Number(req.query.amount || 0);

  if (!code) {
    res.status(400);
    throw new Error("Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  const eligibilityError = await checkCouponEligibility({
    coupon,
    amount: amount || coupon.minAmount || 0,
    userId: req.user._id,
    trip: null,
  });

  res.status(200).json({
    success: true,
    valid: !eligibilityError,
    message: eligibilityError || "Coupon is valid",
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minAmount: coupon.minAmount,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      isActive: coupon.isActive,
      firstTimeUsersOnly: coupon.firstTimeUsersOnly,
      festivalTag: coupon.festivalTag,
    },
  });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description = "",
    autoGenerate = false,
    prefix = "GP",
    discountType,
    discountValue,
    minAmount = 0,
    maxDiscount = 0,
    startDate,
    expiryDate,
    usageLimit = 0,
    perUserLimit = 1,
    applicableRoutes = [],
    firstTimeUsersOnly = false,
    festivalTag = "",
  } = req.body;

  if (!discountType || discountValue === undefined || !expiryDate) {
    res.status(400);
    throw new Error("discountType, discountValue and expiryDate are required");
  }

  let finalCode = String(code || "").trim().toUpperCase();
  if (autoGenerate || !finalCode) {
    const generated = voucherCodeGenerator.generate({
      prefix: `${String(prefix || "GP").toUpperCase()}-`,
      length: 8,
      count: 1,
      charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });
    finalCode = generated[0];
  }

  const existing = await Coupon.findOne({ code: finalCode });
  if (existing) {
    res.status(400);
    throw new Error("Coupon code already exists");
  }

  const coupon = await Coupon.create({
    code: finalCode,
    description,
    discountType,
    discountValue,
    minAmount,
    maxDiscount,
    startDate: startDate || new Date(),
    expiryDate,
    usageLimit,
    perUserLimit,
    applicableRoutes,
    firstTimeUsersOnly,
    festivalTag,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({})
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    coupons,
  });
});

export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
    coupon,
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  // Prevent code change if not authorized or keep it simple
  if (updates.code) {
    updates.code = String(updates.code).trim().toUpperCase();
    const existing = await Coupon.findOne({ code: updates.code, _id: { $ne: id } });
    if (existing) {
      res.status(400);
      throw new Error("Coupon code already in use");
    }
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon: updatedCoupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  // Check if it's been used
  if (coupon.usedCount > 0) {
    res.status(400);
    throw new Error("Cannot delete a coupon that has already been used. Please deactivate it instead.");
  }

  await Coupon.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});
