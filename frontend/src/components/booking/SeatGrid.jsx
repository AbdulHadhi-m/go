import SeatItem from "./SeatItem";

export default function SeatGrid({
  seats = [],
  booked = [],
  selected = [],
  onSelect,
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100">
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <span className="rounded-full bg-red-100 px-4 py-2 text-red-700">
          Available
        </span>
        <span className="rounded-full bg-red-700 px-4 py-2 text-white">
          Selected
        </span>
        <span className="rounded-full bg-slate-200 px-4 py-2 text-slate-700">
          Booked
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 md:grid-cols-6">
        {seats.map((seat) => (
          <SeatItem
            key={seat}
            seat={seat}
            isBooked={booked.includes(seat)}
            isSelected={selected.includes(seat)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}