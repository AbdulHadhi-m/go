export default function RouteCard({ route }) {
  return (
    <div className="rounded-2xl p-4">
      <h3 className="text-2xl font-bold text-slate-900">{route.city} Buses</h3>
      <p className="mt-3 text-lg text-slate-600">
        To:{" "}
        <span className="text-blue-600">
          {route.destinations.join(", ")}
        </span>
      </p>
    </div>
  );
}