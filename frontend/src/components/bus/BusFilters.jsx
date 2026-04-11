export default function BusFilters() {
  return (
    <aside className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-red-100">
      <h3 className="text-lg font-bold text-slate-900">Filters</h3>

      <div className="mt-4 space-y-4 text-sm text-slate-600">
        <div className="rounded-2xl bg-red-50 p-4">AC / Non AC</div>
        <div className="rounded-2xl bg-red-50 p-4">Sleeper / Seater</div>
        <div className="rounded-2xl bg-red-50 p-4">Departure Time</div>
        <div className="rounded-2xl bg-red-50 p-4">Price Range</div>
      </div>
    </aside>
  );
}