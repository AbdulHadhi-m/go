export default function SeatItem({ seat, isBooked, isSelected, onSelect }) {
  const styles = isBooked
    ? "cursor-not-allowed bg-slate-200 text-slate-500"
    : isSelected
    ? "bg-violet-700 text-white"
    : "border border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100";

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