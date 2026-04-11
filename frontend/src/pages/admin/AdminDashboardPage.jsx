import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import {
  approveOperator,
  clearAdminMessage,
  deleteAnyBus,
  fetchAdminDashboard,
  rejectOperator,
  toggleUserBlock,
  updateComplaint,
} from "../../features/admin/adminSlice";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const {
    stats,
    dailyBookings = [],
    users = [],
    operators = [],
    buses = [],
    bookings = [],
    complaints = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminMessage());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAdminMessage());
      dispatch(fetchAdminDashboard());
    }
  }, [error, successMessage, dispatch]);

  const maxDaily = Math.max(...dailyBookings.map((d) => d.count), 1);
  const cards = [
    ["Total Users", stats?.totalUsers || 0],
    ["Total Operators", stats?.totalOperators || 0],
    ["Total Buses", stats?.totalBuses || 0],
    ["Total Trips", stats?.totalTrips || 0],
    ["Total Bookings", stats?.totalBookings || 0],
    ["Total Revenue", `₹${stats?.totalRevenue || 0}`],
    ["Cancelled Tickets", stats?.cancelledTickets || 0],
    ["Active Routes", stats?.activeRoutes || 0],
  ];

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">System super control center.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-2xl font-bold text-red-700">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
          <h2 className="text-xl font-bold text-slate-900">Daily Booking Chart (Last 7 Days)</h2>
          <div className="mt-4 flex items-end gap-3">
            {dailyBookings.map((point) => (
              <div key={point.date} className="flex w-full flex-col items-center">
                <div
                  className="w-full rounded-t-md bg-red-500"
                  style={{ height: `${Math.max(12, (point.count / maxDaily) * 140)}px` }}
                  title={`${point.date}: ${point.count}`}
                />
                <p className="mt-1 text-[10px] text-slate-500">{point.date.slice(5)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-slate-900">Users</h2>
            <div className="mt-4 space-y-2">
              {users.slice(0, 8).map((u) => (
                <div key={u._id} className="flex items-center justify-between rounded-xl border p-3">
                  <p className="text-sm">{u.firstName} {u.lastName} · {u.role}</p>
                  <button
                    onClick={() => dispatch(toggleUserBlock(u._id))}
                    className="rounded-lg border px-3 py-1 text-xs"
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-slate-900">Operators</h2>
            <div className="mt-4 space-y-2">
              {operators.slice(0, 8).map((u) => (
                <div key={u._id} className="flex items-center justify-between rounded-xl border p-3">
                  <p className="text-sm">{u.firstName} {u.lastName} · {u.operatorApplicationStatus || u.role}</p>
                  <div className="flex gap-2">
                    <button onClick={() => dispatch(approveOperator(u._id))} className="rounded-lg border px-3 py-1 text-xs">Approve</button>
                    <button onClick={() => dispatch(rejectOperator({ userId: u._id, reason: "Rejected by admin" }))} className="rounded-lg border border-rose-200 px-3 py-1 text-xs text-rose-600">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-slate-900">Buses</h2>
            <div className="mt-4 space-y-2">
              {buses.slice(0, 8).map((b) => (
                <div key={b._id} className="flex items-center justify-between rounded-xl border p-3">
                  <p className="text-sm">{b.name} ({b.busNumber})</p>
                  <button onClick={() => dispatch(deleteAnyBus(b._id))} className="rounded-lg border border-rose-200 px-3 py-1 text-xs text-rose-600">Delete</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-slate-900">Complaints</h2>
            <div className="mt-4 space-y-2">
              {complaints.slice(0, 8).map((c) => (
                <div key={c._id} className="rounded-xl border p-3">
                  <p className="text-sm font-semibold">{c.subject}</p>
                  <p className="text-xs text-slate-500">{c.message}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => dispatch(updateComplaint({ complaintId: c._id, status: "in_progress", resolutionNote: "Investigating" }))} className="rounded-lg border px-2 py-1 text-xs">In Progress</button>
                    <button onClick={() => dispatch(updateComplaint({ complaintId: c._id, status: "resolved", resolutionNote: "Resolved by admin" }))} className="rounded-lg border px-2 py-1 text-xs">Resolve</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
          <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
          <p className="mt-1 text-sm text-slate-500">Showing latest {Math.min(10, bookings.length)} bookings</p>
          <div className="mt-4 space-y-2">
            {bookings.slice(0, 10).map((b) => (
              <div key={b._id} className="rounded-xl border p-3 text-sm">
                {b.user?.firstName} {b.user?.lastName} · {b.trip?.from} → {b.trip?.to} · ₹{b.finalAmount || b.totalAmount}
              </div>
            ))}
          </div>
        </div>
        {loading && <p className="mt-4 text-sm text-slate-500">Refreshing admin data...</p>}
      </section>
    </MainLayout>
  );
}
