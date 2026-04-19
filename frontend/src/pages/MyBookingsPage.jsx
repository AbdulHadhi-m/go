import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import {
  cancelBooking,
  clearBookingMessage,
  getMyBookings,
} from "../features/bookings/bookingSlice";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const dispatch = useDispatch();

  const {
    bookings = [],
    loading = false,
    error = null,
    successMessage = "",
  } = useSelector((state) => state.bookings || {});

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBookingMessage());
    }

    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearBookingMessage());
    }
  }, [error, successMessage, dispatch]);

  const handleCancel = (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (confirmCancel) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const getRefundBadgeClass = (status) => {
    if (status === "pending") return "bg-amber-100 text-amber-700";
    if (status === "processed") return "bg-emerald-100 text-emerald-700";
    if (status === "failed") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-600";
  };

  const handleDownloadTicket = (booking) => {
    const ticketWindow = window.open("", "_blank", "width=900,height=700");

    if (!ticketWindow) {
      toast.error("Popup blocked. Please allow popups.");
      return;
    }

    const ticketHtml = `
      <html>
        <head>
          <title>Ticket - ${booking._id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #1e293b;
            }
            .ticket {
              max-width: 700px;
              margin: auto;
              border: 1px solid #ddd;
              border-radius: 20px;
              padding: 24px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 16px;
              color: #6d28d9;
            }
            .row {
              margin: 10px 0;
              font-size: 16px;
            }
            .label {
              font-weight: bold;
            }
            .status {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 999px;
              font-size: 13px;
              font-weight: bold;
              text-transform: capitalize;
              background: ${
                booking.bookingStatus === "cancelled" ? "#ffedd5" : "#dcfce7"
              };
              color: ${
                booking.bookingStatus === "cancelled" ? "#f97316" : "#16a34a"
              };
            }
            .footer {
              margin-top: 24px;
              font-size: 14px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="title">GoPath Bus Ticket</div>

            <div class="row"><span class="label">Route:</span> ${
              booking.trip?.from || "-"
            } → ${booking.trip?.to || "-"}</div>

            <div class="row"><span class="label">Bus:</span> ${
              booking.trip?.busName || "Bus Name"
            }</div>

            <div class="row"><span class="label">Seats:</span> ${
              booking.seats?.join(", ") || "-"
            }</div>

            <div class="row"><span class="label">Amount:</span> ₹${
              booking.totalAmount || 0
            }</div>

            <div class="row"><span class="label">Payment:</span> ${
              booking.paymentStatus || "-"
            }</div>

            <div class="row"><span class="label">Status:</span> 
              <span class="status">${booking.bookingStatus || "-"}</span>
            </div>

            <div class="row"><span class="label">Date:</span> ${
              booking.trip?.journeyDate
                ? new Date(booking.trip.journeyDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                : booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "-"
            }</div>

            <div class="row"><span class="label">Departure Time:</span> ${
              booking.trip?.departureTime || "-"
            }</div>

            <div class="row"><span class="label">Booking ID:</span> ${
              booking._id
            }</div>

            <div class="footer">
              Thank you for booking with GoPath.
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    ticketWindow.document.open();
    ticketWindow.document.write(ticketHtml);
    ticketWindow.document.close();
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              My Bookings
            </h1>
            <p className="mt-2 text-slate-600">
              Manage upcoming and completed journeys.
            </p>
          </div>

          <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            {bookings.length} Total Tickets
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-red-100">
            <p className="text-slate-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-red-600">
              Failed to load bookings
            </h2>
            <p className="mt-2 text-slate-600">{error}</p>

            <button
              onClick={() => dispatch(getMyBookings())}
              className="mt-4 rounded-2xl bg-red-700 px-5 py-3 font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-slate-900">
              No bookings found
            </h2>
            <p className="mt-2 text-slate-600">
              Your booked tickets will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900">
                        {booking.trip?.from || "From"} → {booking.trip?.to || "To"}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          booking.bookingStatus === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Seats: {booking.seats?.join(", ") || "-"} ·{" "}
                      {booking.trip?.busName || "Bus Name"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Amount: ₹{booking.totalAmount}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Payment: {booking.paymentStatus}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Free cancellation before 24 hrs · 10% charge within 24 hrs
                      · Cancellation closes 2 hrs before departure
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Date:{" "}
                      {booking.trip?.journeyDate
                        ? new Date(booking.trip.journeyDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "-"}
                    </p>

                    {booking.bookingStatus === "cancelled" && (
                      <>
                        <p className="mt-1 text-sm text-slate-500">
                          Cancelled on:{" "}
                          {booking.cancelledAt
                            ? new Date(booking.cancelledAt).toLocaleString()
                            : "-"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRefundBadgeClass(
                              booking.refundStatus
                            )}`}
                          >
                            Refund {booking.refundStatus || "not_applicable"}
                          </span>
                          {booking.refundAmount > 0 && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Refund: ₹{booking.refundAmount}
                            </span>
                          )}
                          {booking.cancellationCharge > 0 && (
                            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                              Charge: ₹{booking.cancellationCharge}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      className="rounded-2xl bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800"
                    >
                      Download Ticket
                    </button>

                    {booking.bookingStatus !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={loading}
                        className="rounded-2xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        {loading ? "Cancelling..." : "Cancel Booking"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}