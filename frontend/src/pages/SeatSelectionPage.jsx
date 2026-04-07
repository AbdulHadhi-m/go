import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Armchair, CheckCircle2, Ticket } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { getTripById, getTripSeats } from "../features/trips/tripSlice";

export default function SeatSelectionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { trip, seatsData, loading, error } = useSelector(
    (state) => state.trips || {}
  );

  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    dispatch(getTripById(id));
    dispatch(getTripSeats(id));
  }, [dispatch, id]);

  const allSeats = useMemo(() => {
    const seats = [];
    const rows = ["A", "B", "C", "D", "E", "F"];
    const perRow = 6;

    rows.forEach((row) => {
      for (let i = 1; i <= perRow; i += 1) {
        seats.push(`${row}${i}`);
      }
    });

    return seats;
  }, []);

  const bookedSeats = seatsData?.bookedSeats || [];

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((item) => item !== seat)
        : [...prev, seat]
    );
  };

  const totalAmount = selectedSeats.length * (trip?.fare || 0);

  if (loading && !trip) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50 px-4 py-10 md:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl">
            <p className="text-slate-600">Loading seats...</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50 px-4 py-10 md:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl">
            <p className="text-red-600">{error}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-700 p-6 text-white shadow-xl shadow-violet-200">
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Select Your Seats
            </h1>
            <p className="mt-2 text-white/85">
              {trip?.busName} • {trip?.from} → {trip?.to}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Seat layout */}
            <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100">
              <div className="mb-6 flex flex-wrap gap-4 text-sm">
                <div className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-slate-200" />
                  Available
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-violet-600" />
                  Selected
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-rose-400" />
                  Booked
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {allSeats.map((seat) => {
                  const isBooked = bookedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);

                  return (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isBooked}
                      className={`flex h-16 flex-col items-center justify-center rounded-[1.25rem] border text-sm font-semibold transition ${
                        isBooked
                          ? "cursor-not-allowed border-rose-200 bg-rose-400 text-white"
                          : isSelected
                          ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-200"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300 hover:bg-violet-50"
                      }`}
                    >
                      <Armchair size={18} />
                      <span className="mt-1">{seat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100">
                <h3 className="text-xl font-bold text-slate-900">
                  Booking Summary
                </h3>

                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Route</span>
                    <span className="font-semibold text-slate-900">
                      {trip?.from} → {trip?.to}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Bus</span>
                    <span className="font-semibold text-slate-900">
                      {trip?.busName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Selected Seats</span>
                    <span className="font-semibold text-slate-900">
                      {selectedSeats.length > 0
                        ? selectedSeats.join(", ")
                        : "None"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Price per Seat</span>
                    <span className="font-semibold text-slate-900">
                      ₹{trip?.fare || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white">
                  <p className="text-sm text-white/80">Total Amount</p>
                  <h4 className="mt-2 text-3xl font-extrabold">
                    ₹{totalAmount}
                  </h4>

                  <button
  disabled={selectedSeats.length === 0}
  onClick={() =>
    navigate("/checkout", {
      state: {
        trip,
        selectedSeats,
        totalAmount,
      },
    })
  }
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-white px-4 py-3 font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
>
  Continue Booking
</button>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-900">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Premium journey
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select your preferred seats and continue to booking with a
                  smooth premium checkout experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}