export default function TicketCard({ ticket }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {ticket.from} → {ticket.to}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Seat {ticket.seats.join(", ")} · {ticket.busName}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {ticket.date} · {ticket.departureTime}
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-2xl border border-violet-200 px-4 py-2 font-semibold text-violet-700">
            View Ticket
          </button>
          <button className="rounded-2xl bg-violet-700 px-4 py-2 font-semibold text-white">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}   