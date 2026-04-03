import { Link } from "react-router-dom";

export default function BusCard({ bus }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        
        <div>
          <h3 className="text-xl font-bold text-slate-900">{bus.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{bus.type}</p>
        </div>

        <div className="grid gap-5 text-sm md:grid-cols-4 md:items-center">
          <div>
            <p className="font-semibold">{bus.departureTime}</p>
            <p className="text-slate-500">Departure</p>
          </div>

          <div>
            <p className="font-semibold">{bus.arrivalTime}</p>
            <p className="text-slate-500">Arrival</p>
          </div>

          <div>
            <p className="font-semibold text-violet-700">₹{bus.price}</p>
            <p className="text-slate-500">{bus.availableSeats} seats left</p>
          </div>

          <Link
            to={`/trip/${bus.id}`}
            className="rounded-2xl bg-violet-700 px-4 py-3 text-center font-semibold text-white"
          >
            View Seats
          </Link>
        </div>
      </div>
    </div>
  );
}