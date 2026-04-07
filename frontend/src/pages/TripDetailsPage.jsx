import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bus,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Snowflake,
  Star,
  Ticket,
  Wifi,
  Zap,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { getTripById } from "../features/trips/tripSlice";

export default function TripDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { trip, loading, error } = useSelector((state) => state.trips || {});

  useEffect(() => {
    dispatch(getTripById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50 px-4 py-10 md:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl">
            <p className="text-slate-600">Loading trip details...</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error || !trip) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50 px-4 py-10 md:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl">
            <p className="text-red-600">{error || "Trip not found"}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            {/* Left */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-700 p-7 text-white shadow-xl shadow-violet-200">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {trip.busType}
                  </span>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                    {trip.availableSeats} seats available
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  {trip.busName}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-white/85">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    {trip.from}
                  </span>
                  <span>→</span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    {trip.to}
                  </span>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Travel Timeline
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Departure
                    </p>
                    <p className="mt-2 inline-flex items-center gap-2 text-xl font-bold text-slate-900">
                      <Clock3 size={18} className="text-violet-600" />
                      {trip.departureTime}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{trip.from}</p>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Arrival
                    </p>
                    <p className="mt-2 inline-flex items-center gap-2 text-xl font-bold text-slate-900">
                      <Clock3 size={18} className="text-violet-600" />
                      {trip.arrivalTime}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{trip.to}</p>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Journey Date
                    </p>
                    <p className="mt-2 inline-flex items-center gap-2 text-xl font-bold text-slate-900">
                      <CalendarDays size={18} className="text-violet-600" />
                      {trip.journeyDate
                        ? new Date(trip.journeyDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100">
                <h2 className="text-xl font-bold text-slate-900">Amenities</h2>

                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                    <Snowflake size={16} />
                    AC
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                    <Wifi size={16} />
                    WiFi
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                    <Zap size={16} />
                    Charging Port
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                    <ShieldCheck size={16} />
                    Safe Travel
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                    <Bus size={16} />
                    Premium Coach
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100">
                <div className="rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-lg">
                  <p className="text-sm text-white/80">Starting from</p>
                  <h3 className="mt-2 text-4xl font-extrabold">₹{trip.fare}</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Premium comfort fare
                  </p>

                  <button
                    onClick={() => navigate(`/trip/${trip._id}/seats`)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-white px-5 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
                  >
                    <Ticket size={18} />
                    View Seats
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-violet-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Why choose this bus?
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="rounded-[1.25rem] bg-slate-50 p-4">
                    <p className="inline-flex items-center gap-2 font-semibold text-slate-900">
                      <Star size={16} className="text-amber-500" />
                      Premium experience
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Smooth travel, comfortable seating, and trusted service.
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">
                      Seats available
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {trip.availableSeats} out of {trip.totalSeats} seats left.
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">
                      Flexible journey planning
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      View details now and continue to seat selection when ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}