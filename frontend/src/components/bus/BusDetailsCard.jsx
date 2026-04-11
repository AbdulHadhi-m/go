export default function BusDetailsCard({ trip }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100">
      <div className="flex flex-col gap-6 md:flex-row md:justify-between">
        
        <div>
          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            Trip Details
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
            {trip.name}
          </h1>

          <p className="mt-2 text-slate-600">
            {trip.from} → {trip.to}
          </p>
        </div>

        <div className="rounded-3xl bg-red-50 p-5">
          <p className="text-sm text-slate-500">Starting from</p>
          <h2 className="mt-1 text-3xl font-bold text-red-700">
            ₹{trip.price}
          </h2>
        </div>
      </div>
    </div>
  );
}