export default function SeatItem({ seat, isBooked, isSelected, onSelect }) {
  const styles = isBooked
    ? "cursor-not-allowed bg-slate-200 text-slate-500"
    : isSelected
    ? "bg-red-700 text-white"
    : "border border-red-100 bg-red-50 text-red-700 hover:bg-red-100";

  return (
    <button
      type="button"
      disabled={isBooked}
      onClick={() => onSelect(seat)}
      className={`rounded-2xl px-4 py-5 text-sm font-semibold transition ${styles}`}
    >
      {seat}
    </button>
  );
}