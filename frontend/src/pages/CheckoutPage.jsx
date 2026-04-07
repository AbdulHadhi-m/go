import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { createBooking } from "../features/bookings/bookingSlice";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const { loading } = useSelector((state) => state.bookings || {});

  const trip = location.state?.trip;
  const selectedSeats = location.state?.selectedSeats || [];
  const baseFare = location.state?.totalAmount || 0;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "Male",
  });

  const tax = useMemo(() => Math.round(baseFare * 0.05), [baseFare]);
  const discount = 100;
  const total = baseFare + tax - discount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayNow = async () => {
    if (!trip || selectedSeats.length === 0) {
      toast.error("Trip or seat data is missing");
      return;
    }

    if (!user?.token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.email || !formData.age) {
      toast.error("Please fill all passenger details");
      return;
    }

    const bookingData = {
      tripId: trip._id,
      seats: selectedSeats,
      totalAmount: total,
      passengerDetails: [
        {
          name: formData.fullName,
          age: Number(formData.age),
          gender: formData.gender,
        },
      ],
    };

    try {
      await dispatch(createBooking(bookingData)).unwrap();
      toast.success("Booking created successfully");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error || "Booking failed");
    }
  };

  if (!trip) {
    return (
      <MainLayout>
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <p className="text-red-600">No checkout data found.</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-700 p-6 text-white shadow-xl shadow-violet-200">
            <h1 className="text-3xl font-extrabold md:text-4xl">Secure Checkout</h1>
            <p className="mt-2 text-white/85">
              Complete your premium journey booking.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100 ring-1 ring-violet-100">
              <h1 className="text-3xl font-extrabold text-slate-900">
                Passenger Details
              </h1>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="rounded-2xl border border-violet-100 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200"
                  placeholder="Full name"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-2xl border border-violet-100 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200"
                  placeholder="Phone number"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-2xl border border-violet-100 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200"
                  placeholder="Email"
                />
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="rounded-2xl border border-violet-100 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200"
                  placeholder="Age"
                />
              </div>

              <div className="mt-4">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-violet-100 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mt-8 rounded-3xl bg-violet-50 p-5">
                <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <button
                     type="button"
                     onClick={() => setPaymentMethod("UPI")}
                     className={`rounded-2xl border px-4 py-3 font-semibold ${
                       paymentMethod === "UPI"
                         ? "border-violet-700 bg-violet-700 text-white"
                         : "border-violet-200 bg-white text-violet-700"
                     }`}
                   >
                     UPI
                   </button>
                   <button
                     type="button"
                     onClick={() => setPaymentMethod("Card")}
                     className={`rounded-2xl border px-4 py-3 font-semibold ${
                       paymentMethod === "Card"
                         ? "border-violet-700 bg-violet-700 text-white"
                         : "border-violet-200 bg-white text-violet-700"
                     }`}
                   >
                     Card
                   </button>
                   <button
                     type="button"
                     onClick={() => setPaymentMethod("Wallet")}
                     className={`rounded-2xl border px-4 py-3 font-semibold ${
                       paymentMethod === "Wallet"
                         ? "border-violet-700 bg-violet-700 text-white"
                         : "border-violet-200 bg-white text-violet-700"
                     }`}
                   >
                     Wallet
                   </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Demo payment flow active. Real payment gateway is bypassed for testing.
                </p>
              </div>
            </div>

            <aside className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100 ring-1 ring-violet-100">
              <h2 className="text-2xl font-bold text-slate-900">Fare Summary</h2>

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
                  <span>-₹{discount}</span>
                </div>

                <div className="flex justify-between border-t pt-4 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayNow}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-800 disabled:opacity-60"
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