import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { createBooking } from "../features/bookings/bookingSlice";
import { applyCoupon, clearCoupon } from "../features/coupon/couponSlice";
import loadRazorpayScript from "../utils/loadRazorpay";
import { createOrderAPI, verifyPaymentAPI } from "../services/paymentService";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const { loading } = useSelector((state) => state.bookings || {});
  const couponState = useSelector((state) => state.coupon || {});

  const trip = location.state?.trip;
  const selectedSeats = location.state?.selectedSeats || [];
  const baseFare = location.state?.totalAmount || 0;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [couponCode, setCouponCode] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "Male",
  });

  const tax = useMemo(() => Math.round(baseFare * 0.05), [baseFare]);
  const amountBeforeOffer = Math.max(0, baseFare + tax);
  const offerApplied = couponState.offerType && couponState.offerType !== "none";
  const total = offerApplied ? couponState.finalAmount : amountBeforeOffer;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    dispatch(clearCoupon());
  }, [dispatch, trip?._id]);

  useEffect(() => {
    if (!trip?._id || amountBeforeOffer <= 0) return;
    dispatch(
      applyCoupon({
        amount: amountBeforeOffer,
        tripId: trip._id,
      })
    );
  }, [dispatch, trip?._id, amountBeforeOffer]);

  const handlePayNow = async () => {
    if (!trip || selectedSeats.length === 0) {
      toast.error("Trip or seat data is missing");
      return;
    }

    if (!user?._id) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.email || !formData.age) {
      toast.error("Please fill all passenger details");
      return;
    }

    if (Number.isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast.error("Please enter a valid passenger age");
      return;
    }

    const bookingData = {
      tripId: trip._id,
      seats: selectedSeats,
      couponCode: couponState.coupon || null,
      paymentMethod,
      passengerDetails: [
        {
          name: formData.fullName,
          age: Number(formData.age),
          gender: formData.gender,
        },
      ],
    };

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const order = await createOrderAPI({
        tripId: trip._id,
        seats: selectedSeats,
        couponCode: couponState.coupon || null,
      });
      if (!order || !order.id) {
        toast.error("Server error. Please try again.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GoPath",
        description: `Booking for ${trip.from} to ${trip.to}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyPayload = {
              orderCreationId: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              ...bookingData,
            };

            const verificationResult = await verifyPaymentAPI(verifyPayload);
            if (verificationResult.success) {
              toast.success("Payment successful! Booking confirmed.");
              dispatch(clearCoupon());
              navigate("/my-bookings");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            toast.error(error?.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
          // Pre-select tab based on user UI choice, but leave all options available
          method: paymentMethod.toLowerCase() === "wallet" ? "wallet" : paymentMethod.toLowerCase() === "card" ? "card" : "upi",
        },
        theme: {
          color: "#b91c1c",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
      });
      paymentObject.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to initiate payment");
    }
  };

  const handleApplyCoupon = async () => {
    if (!trip?._id) {
      toast.error("Trip data missing");
      return;
    }
    try {
      const response = await dispatch(
        applyCoupon({
          code: couponCode.trim() || undefined,
          amount: amountBeforeOffer,
          tripId: trip._id,
        })
      ).unwrap();
      toast.success(response.selectedOfferReason || "Offer applied");
    } catch (error) {
      toast.error(error || "Unable to apply coupon");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon());
    setCouponCode("");
    toast.success("Offer removed");
  };

  if (!trip) {
    return (
      <MainLayout>
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100">
            <p className="text-red-600">No checkout data found.</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-700 via-red-700 to-red-700 p-6 text-white shadow-xl shadow-red-200">
            <h1 className="text-3xl font-extrabold md:text-4xl">Secure Checkout</h1>
            <p className="mt-2 text-white/85">
              Complete your premium journey booking.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-red-100 ring-1 ring-red-100">
              <h1 className="text-3xl font-extrabold text-slate-900">
                Passenger Details
              </h1>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Full name"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Phone number"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Email"
                />
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Age"
                />
              </div>

              <div className="mt-4">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mt-8 rounded-3xl bg-red-50 p-5">
                <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <button
                     type="button"
                     onClick={() => setPaymentMethod("UPI")}
                     className={`rounded-2xl border px-4 py-3 font-semibold ${
                       paymentMethod === "UPI"
                         ? "border-red-700 bg-red-700 text-white"
                         : "border-red-200 bg-white text-red-700"
                     }`}
                   >
                     UPI
                   </button>
                   <button
                     type="button"
                     onClick={() => setPaymentMethod("Card")}
                     className={`rounded-2xl border px-4 py-3 font-semibold ${
                       paymentMethod === "Card"
                         ? "border-red-700 bg-red-700 text-white"
                         : "border-red-200 bg-white text-red-700"
                     }`}
                   >
                     Card
                   </button>
                   <button
                     type="button"
                     onClick={() => setPaymentMethod("Wallet")}
                     className={`rounded-2xl border px-4 py-3 font-semibold ${
                       paymentMethod === "Wallet"
                         ? "border-red-700 bg-red-700 text-white"
                         : "border-red-200 bg-white text-red-700"
                     }`}
                   >
                     Wallet
                   </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Secure payments via Razorpay Test Gateway. Please use test credentials for test mode.
                </p>
              </div>
            </div>

            <aside className="rounded-[2rem] bg-white p-6 shadow-xl shadow-red-100 ring-1 ring-red-100">
              <h2 className="text-2xl font-bold text-slate-900">Fare Summary</h2>

              <div className="mt-4 rounded-2xl bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-700">
                  Enter coupon code (optional)
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="NEWUSER50"
                    className="w-full rounded-xl border border-red-200 px-3 py-2 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponState.isLoading}
                    className="rounded-xl bg-red-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {couponState.isLoading ? "..." : "Apply"}
                  </button>
                </div>
                {offerApplied && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-red-700">
                      {couponState.offerType === "first_booking_auto"
                        ? "First Booking Offer Applied - 10% OFF"
                        : `Better Coupon Applied - ₹${couponState.discountAmount} OFF`}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-semibold text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Route</span>
                  <span className="font-medium text-slate-900">
                    {trip.from} → {trip.to}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Bus</span>
                  <span className="font-medium text-slate-900">{trip.busName}</span>
                </div>

                <div className="flex justify-between">
                  <span>Seats</span>
                  <span className="font-medium text-slate-900">
                    {selectedSeats.join(", ")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>₹{baseFare}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-₹{couponState.discountAmount || 0}</span>
                </div>

                {offerApplied && (
                  <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                    {couponState.selectedOfferReason}
                  </div>
                )}

                <div className="flex justify-between border-t pt-4 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-700 hover:to-red-800 disabled:opacity-60"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}