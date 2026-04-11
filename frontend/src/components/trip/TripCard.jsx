export default function TripCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-red-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}