import BusCard from "./BusCard";

export default function BusList({ buses = [] }) {
  return (
    <div className="space-y-5">
      {buses.length > 0 ? (
        buses.map((bus) => <BusCard key={bus.id} bus={bus} />)
      ) : (
        <p className="text-center text-slate-500">No buses found</p>
      )}
    </div>
  );
}