import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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

const SUGGESTED_CITIES = [
  "Bangalore",
  "Calicut",
  "Chennai",
  "Coimbatore",
  "Ernakulam",
  "Goa",
  "Hyderabad",
  "Kannur",
  "Kochi",
  "Kozhikode",
  "Madurai",
  "Mangalore",
  "Mumbai",
  "Mysore",
  "Pune",
  "Thrissur",
  "Trivandrum",
];
import MainLayout from "../components/layout/MainLayout";
import FavoriteButton from "../components/common/FavoriteButton";
import BusCard from "../components/bus/BusCard";
import { selectIsAuthenticated } from "../features/auth/authSelectors";
import { getMyFavorites } from "../features/favorites/favoriteSlice";
import { getTrips } from "../features/trips/tripSlice";

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { trips = [], loading = false, error = null } = useSelector(
    (state) => state.trips || {}
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

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

  const dropdownRef = useRef(null);
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(
      getTrips({
        from: queryParams.get("from") || "",
        to: queryParams.get("to") || "",
        date: queryParams.get("date") || "",
      })
    );
  }, [dispatch, queryParams]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "from" || name === "to") setActiveField(name);
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
      <section className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="mb-6 flex items-center">
            <Link
              to="/"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/60 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Back to home"
              title="Back to home"
            >
              <ArrowLeft size={22} strokeWidth={2.25} />
            </Link>
          </div>

          {/* Top Header */}
          <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-700 via-red-700 to-red-700 p-6 text-white shadow-xl shadow-red-200 md:rounded-[2.5rem] md:p-8">
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
          <div className="relative z-50 mb-8 rounded-[2rem] border border-white/60 bg-white/80 p-4 shadow-xl shadow-red-100 backdrop-blur-xl md:p-5">
            <div className="grid gap-4 md:grid-cols-5">
              <div ref={activeField === "from" ? dropdownRef : null} className="relative flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <MapPin className="text-red-600" size={18} />
                <input
                  type="text"
                  name="from"
                  value={filters.from}
                  onChange={handleChange}
                  onFocus={() => setActiveField("from")}
                  autoComplete="off"
                  placeholder="From"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                />
                {activeField === "from" && (
                  <div className="absolute left-0 top-full z-[100] mt-2 max-h-60 w-full overflow-y-auto rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
                    {SUGGESTED_CITIES.filter((c) =>
                      c.toLowerCase().includes(filters.from.toLowerCase())
                    ).map((city) => (
                      <div
                        key={city}
                        onClick={() => {
                          setFilters((p) => ({ ...p, from: city }));
                          setActiveField(null);
                        }}
                        className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        {city}
                      </div>
                    ))}
                    {SUGGESTED_CITIES.filter((c) =>
                      c.toLowerCase().includes(filters.from.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-sm text-slate-500">
                        No suggestions
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div ref={activeField === "to" ? dropdownRef : null} className="relative flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <MapPin className="text-red-600" size={18} />
                <input
                  type="text"
                  name="to"
                  value={filters.to}
                  onChange={handleChange}
                  onFocus={() => setActiveField("to")}
                  autoComplete="off"
                  placeholder="To"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                />
                {activeField === "to" && (
                  <div className="absolute left-0 top-full z-[100] mt-2 max-h-60 w-full overflow-y-auto rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
                    {SUGGESTED_CITIES.filter((c) =>
                      c.toLowerCase().includes(filters.to.toLowerCase())
                    ).map((city) => (
                      <div
                        key={city}
                        onClick={() => {
                          setFilters((p) => ({ ...p, to: city }));
                          setActiveField(null);
                        }}
                        className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        {city}
                      </div>
                    ))}
                    {SUGGESTED_CITIES.filter((c) =>
                      c.toLowerCase().includes(filters.to.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-sm text-slate-500">
                        No suggestions
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <CalendarDays className="text-red-600" size={18} />
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-medium outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <ArrowUpDown className="text-red-600" size={18} />
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
                className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-red-600 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:scale-[1.01] hover:from-red-700 hover:to-red-700"
              >
                <Search size={18} />
                Update Search
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
            {/* Sidebar */}
            <aside className="h-fit rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-xl shadow-red-100 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <Filter className="text-red-700" size={18} />
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-red-50 to-red-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Bus Type
                  </label>
                  <select
                    name="busType"
                    value={filters.busType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-red-100 bg-white px-3 py-2 text-sm outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="ac">AC</option>
                    <option value="non ac">Non AC</option>
                    <option value="sleeper">Sleeper</option>
                    <option value="seater">Seater</option>
                  </select>
                </div>

                <div className="rounded-[1.5rem] bg-gradient-to-br from-red-50 to-red-50 p-4">
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
                <div className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-xl shadow-red-100">
                  <p className="text-slate-600">Loading premium bus results...</p>
                </div>
              ) : error ? (
                <div className="rounded-[2rem] border border-red-100 bg-white p-8 shadow-lg">
                  <p className="font-medium text-red-600">{error}</p>
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="rounded-[2rem] border border-white/60 bg-white/80 p-10 text-center shadow-xl shadow-red-100">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <Bus className="text-red-700" size={28} />
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
                  <BusCard key={trip._id || trip.id} bus={trip} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}