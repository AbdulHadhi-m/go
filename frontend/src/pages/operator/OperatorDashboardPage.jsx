import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import {
  clearOperatorMessage,
  createBus,
  createTrip,
  getOperatorDashboardData,
  markTripCompleted,
  cancelTrip,
} from "../../features/operator/operatorSlice";

export default function OperatorDashboardPage() {
  const dispatch = useDispatch();
  const {
    buses = [],
    trips = [],
    bookings = [],
    revenueSummary,
    routeAnalytics = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.operator || {});

  const [busForm, setBusForm] = useState({ name: "", busNumber: "", type: "AC Sleeper" });
  const [tripForm, setTripForm] = useState({
    busId: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    journeyDate: "",
    seatPrice: "",
    totalSeats: "",
  });

  useEffect(() => {
    dispatch(getOperatorDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // UX: auto-select the only bus to avoid accidental empty busId submits.
    if (buses.length === 1 && !tripForm.busId) {
      setTripForm((s) => ({ ...s, busId: buses[0]._id }));
    }
  }, [buses, tripForm.busId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOperatorMessage());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearOperatorMessage());
    }
  }, [error, successMessage, dispatch]);

  const submitBus = async (e) => {
    e.preventDefault();
    if (!busForm.name.trim() || !busForm.busNumber.trim()) {
      toast.error("Bus name and bus number are required");
      return;
    }
    await dispatch(createBus(busForm));
    setBusForm({ name: "", busNumber: "", type: "AC Sleeper" });
  };

  const submitTrip = async (e) => {
    e.preventDefault();
    if (!tripForm.busId) {
      toast.error("Please select a bus");
      return;
    }
    if (!tripForm.from.trim() || !tripForm.to.trim()) {
      toast.error("From and To are required");
      return;
    }
    if (!tripForm.departureTime.trim() || !tripForm.arrivalTime.trim()) {
      toast.error("Departure and arrival time are required");
      return;
    }
    if (!tripForm.journeyDate) {
      toast.error("Please choose a valid journey date");
      return;
    }
    if (!tripForm.seatPrice || Number(tripForm.seatPrice) <= 0) {
      toast.error("Seat price must be greater than 0");
      return;
    }

    await dispatch(
      createTrip({
        ...tripForm,
        seatPrice: Number(tripForm.seatPrice || 0),
        totalSeats: Number(tripForm.totalSeats || 40),
      })
    );
    setTripForm({
      busId: buses.length === 1 ? buses[0]._id : "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      journeyDate: "",
      seatPrice: "",
      totalSeats: "",
    });
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Operator Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Manage buses, trips, bookings, passengers, and performance.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100">
            <p className="text-sm text-slate-500">Total Buses</p>
            <p className="text-2xl font-bold text-red-700">{buses.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100">
            <p className="text-sm text-slate-500">Total Trips</p>
            <p className="text-2xl font-bold text-red-700">{trips.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100">
            <p className="text-sm text-slate-500">Bookings</p>
            <p className="text-2xl font-bold text-red-700">{bookings.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100">
            <p className="text-sm text-slate-500">Net Revenue</p>
            <p className="text-2xl font-bold text-red-700">
              ₹{revenueSummary?.netRevenue || 0}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitBus} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-slate-900">Add Bus</h2>
            <div className="mt-4 grid gap-3">
              <input required className="rounded-xl border px-3 py-2" placeholder="Bus name" value={busForm.name} onChange={(e) => setBusForm((s) => ({ ...s, name: e.target.value }))} />
              <input required className="rounded-xl border px-3 py-2" placeholder="Bus number" value={busForm.busNumber} onChange={(e) => setBusForm((s) => ({ ...s, busNumber: e.target.value }))} />
              <input className="rounded-xl border px-3 py-2" placeholder="Type" value={busForm.type} onChange={(e) => setBusForm((s) => ({ ...s, type: e.target.value }))} />
              <button disabled={loading} className="rounded-xl bg-red-700 px-4 py-2 font-semibold text-white">Save Bus</button>
            </div>
          </form>

          <form onSubmit={submitTrip} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-slate-900">Add Trip Schedule</h2>
            <div className="mt-4 grid gap-3">
              <select required className="rounded-xl border px-3 py-2" value={tripForm.busId} onChange={(e) => setTripForm((s) => ({ ...s, busId: e.target.value }))}>
                <option value="">Select bus</option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>{bus.name} ({bus.busNumber})</option>
                ))}
              </select>
              <input required className="rounded-xl border px-3 py-2" placeholder="From" value={tripForm.from} onChange={(e) => setTripForm((s) => ({ ...s, from: e.target.value }))} />
              <input required className="rounded-xl border px-3 py-2" placeholder="To" value={tripForm.to} onChange={(e) => setTripForm((s) => ({ ...s, to: e.target.value }))} />
              <input required className="rounded-xl border px-3 py-2" placeholder="Departure time (e.g. 09:00 PM)" value={tripForm.departureTime} onChange={(e) => setTripForm((s) => ({ ...s, departureTime: e.target.value }))} />
              <input required className="rounded-xl border px-3 py-2" placeholder="Arrival time (e.g. 06:30 AM)" value={tripForm.arrivalTime} onChange={(e) => setTripForm((s) => ({ ...s, arrivalTime: e.target.value }))} />
              <input required type="date" className="rounded-xl border px-3 py-2" value={tripForm.journeyDate} onChange={(e) => setTripForm((s) => ({ ...s, journeyDate: e.target.value }))} />
              <input required min="1" type="number" className="rounded-xl border px-3 py-2" placeholder="Seat price" value={tripForm.seatPrice} onChange={(e) => setTripForm((s) => ({ ...s, seatPrice: e.target.value }))} />
              <button disabled={loading} className="rounded-xl bg-red-700 px-4 py-2 font-semibold text-white">Create Trip</button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
          <h2 className="text-xl font-bold text-slate-900">Trips</h2>
          <div className="mt-4 space-y-3">
            {trips.map((trip) => (
              <div key={trip._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3">
                <p className="font-semibold">{trip.from} → {trip.to} · {trip.journeyDate ? new Date(trip.journeyDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-"}</p>
                <div className="flex gap-2">
                  <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => dispatch(markTripCompleted(trip._id))}>Complete</button>
                  <button className="rounded-lg border border-rose-200 px-3 py-1 text-sm text-rose-600" onClick={() => dispatch(cancelTrip({ tripId: trip._id, reason: "Cancelled by operator" }))}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
          <h2 className="text-xl font-bold text-slate-900">Route Performance Analytics</h2>
          <div className="mt-4 space-y-2 text-sm">
            {routeAnalytics.map((row) => (
              <div key={row.route} className="rounded-xl border p-3">
                <p className="font-semibold">{row.route}</p>
                <p className="text-slate-600">
                  Trips: {row.trips} · Avg Occupancy: {row.averageOccupancy}% · Completed: {row.completedTrips} · Cancelled: {row.cancelledTrips}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
