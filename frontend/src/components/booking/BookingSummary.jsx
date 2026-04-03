export default function BookingSummary({
  route,
  selectedSeats = [],
  totalFare = 0,
  onContinue,
}) {
  return (
    <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
      <h2 className="text-2xl font-bold text-slate-900">Booking Summary</h2>

      <div className="mt-5 space-y-4 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Route</span>
          <span>{route}</span>
        </div>

        <div className="flex justify-between">
          <span>Seats</span>
          <span>{selectedSeats.length ? selectedSeats.join(", ") : "-"}</span>
        </div>

        <div className="flex justify-between">
          <span>Fare</span>
          <span>₹{totalFare}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-8 w-full rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white"
      >
        Continue to Checkout
      </button>
    </aside>
  );
}