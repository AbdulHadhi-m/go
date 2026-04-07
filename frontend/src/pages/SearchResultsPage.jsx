import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Bus,
  CalendarDays,
  Clock3,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Ticket,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { getTrips } from "../features/trips/tripSlice";

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { trips = [], loading = false, error = null } = useSelector(
    (state) => state.trips || {}
  );

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [filters, setFilters] = useState({
    from: queryParams.get("from") || "",
    to: queryParams.get("to") || "",
    date: queryParams.get("date") || "",
    sort: "recommended",
    busType: "all",
  });

  useEffect(() => {
    dispatch(
      getTrips({
        from: queryParams.get("from") || "",
        to: queryParams.get("to") || "",
        date: queryParams.get("date") || "",
      })
    );
  }, [dispatch, queryParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchUpdate = () => {
    const params = new URLSearchParams();

    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.date) params.set("date", filters.date);

    navigate(`/search-results?${params.toString()}`);
  };

  const filteredTrips = useMemo(() => {
    let updatedTrips = [...trips];

    if (filters.busType !== "all") {
      updatedTrips = updatedTrips.filter((trip) =>
        trip.busType?.toLowerCase().includes(filters.busType.toLowerCase())
      );
    }

    if (filters.sort === "priceLowToHigh") {
      updatedTrips.sort((a, b) => a.fare - b.fare);
    } else if (filters.sort === "priceHighToLow") {
      updatedTrips.sort((a, b) => b.fare - a.fare);
    } else if (filters.sort === "departureEarly") {
      updatedTrips.sort((a, b) =>
        a.departureTime.localeCompare(b.departureTime)
      );
    }

    return updatedTrips;
  }, [trips, filters]);

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          {/* Top Header */}
          <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-700 p-6 text-white shadow-xl shadow-violet-200 md:rounded-[2.5rem] md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <Sparkles size={16} />
                  Premium bus search experience
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  Find your perfect ride
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
                  Explore premium buses, compare seats, check timing, and book
                  your journey with confidence.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white/10 px-5 py-4 backdrop-blur-md">
                <p className="text-sm text-white/80">Available Results</p>
                <p className="mt-1 text-3xl font-extrabold">
                  {filteredTrips.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search Panel */}
          <div className="mb-8 rounded-[2rem] border border-white/60 bg-white/80 p-4 shadow-xl shadow-violet-100 backdrop-blur-xl md:p-5">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <MapPin className="text-violet-600" size={18} />
                <input
                  type="text"
                  name="from"
                  value={filters.from}
                  onChange={handleChange}
                  placeholder="From"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <MapPin className="text-violet-600" size={18} />
                <input
                  type="text"
                  name="to"
                  value={filters.to}
                  onChange={handleChange}
                  placeholder="To"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <CalendarDays className="text-violet-600" size={18} />
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-medium outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <ArrowUpDown className="text-violet-600" size={18} />
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-medium outline-none"
                >
                  <option value="recommended">Recommended</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="departureEarly">Early Departure</option>
                </select>
              </div>

              <button
                onClick={handleSearchUpdate}
                className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:from-violet-700 hover:to-indigo-700"
              >
                <Search size={18} />
                Update Search
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
            {/* Sidebar */}
            <aside className="h-fit rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-xl shadow-violet-100 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <Filter className="text-violet-700" size={18} />
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Bus Type
                  </label>
                  <select
                    name="busType"
                    value={filters.busType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="ac">AC</option>
                    <option value="non ac">Non AC</option>
                    <option value="sleeper">Sleeper</option>
                    <option value="seater">Seater</option>
                  </select>
                </div>

                <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    Premium Note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Elegant filters are active. More filters like departure
                    range, amenities, and rating can be added next.
                  </p>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="space-y-5">
              {loading ? (
                <div className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-xl shadow-violet-100">
                  <p className="text-slate-600">Loading premium bus results...</p>
                </div>
              ) : error ? (
                <div className="rounded-[2rem] border border-red-100 bg-white p-8 shadow-lg">
                  <p className="font-medium text-red-600">{error}</p>
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="rounded-[2rem] border border-white/60 bg-white/80 p-10 text-center shadow-xl shadow-violet-100">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
                    <Bus className="text-violet-700" size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    No buses found
                  </h2>
                  <p className="mt-2 text-slate-500">
                    Try changing the route, date, or filters.
                  </p>
                </div>
              ) : (
                filteredTrips.map((trip) => (
                  <div
                    key={trip._id}
                    className="group overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-xl shadow-violet-100 backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-200"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                      {/* Left */}
                      <div className="flex-1">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                            {trip.busType || "Premium Coach"}
                          </div>
                          <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {trip.availableSeats} seats left
                          </div>
                        </div>

                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                          {trip.busName}
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={16} className="text-violet-600" />
                            {trip.from}
                          </span>
                          <span className="text-slate-300">→</span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={16} className="text-violet-600" />
                            {trip.to}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">
                          <div className="rounded-[1.25rem] bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Departure
                            </p>
                            <p className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                              <Clock3 size={18} className="text-violet-600" />
                              {trip.departureTime}
                            </p>
                          </div>

                          <div className="rounded-[1.25rem] bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Arrival
                            </p>
                            <p className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                              <Clock3 size={18} className="text-violet-600" />
                              {trip.arrivalTime}
                            </p>
                          </div>

                          <div className="rounded-[1.25rem] bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Travel Date
                            </p>
                            <p className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                              <CalendarDays
                                size={18}
                                className="text-violet-600"
                              />
                              {trip.journeyDate
                                ? new Date(trip.journeyDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="xl:w-[260px]">
                        <div className="rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-lg shadow-violet-200">
                          <p className="text-sm text-white/80">Starting from</p>
                          <h3 className="mt-2 text-4xl font-extrabold tracking-tight">
                            ₹{trip.fare}
                          </h3>

                          <div className="mt-5 space-y-3">
                           <button
  onClick={() => navigate(`/trip/${trip._id}/seats`)}
  className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-white px-4 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
>
  <Ticket size={18} />
  View Seats
</button>

<button
  onClick={() => navigate(`/trip/${trip._id}`)}
  className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
>
  View Details
</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}