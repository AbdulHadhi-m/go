export default function TripInfo({ trip }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100">
      <h2 className="text-2xl font-bold text-slate-900">Trip Info</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-red-50 p-4">
          Date: {trip.date}
        </div>

        <div className="rounded-2xl bg-red-50 p-4">
          Duration: {trip.duration}
        </div>

        <div className="rounded-2xl bg-red-50 p-4">
          Bus Type: {trip.type}
        </div>
      </div>
    </div>
  );
}