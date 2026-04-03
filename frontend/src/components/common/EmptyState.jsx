export default function EmptyState({
  title = "No data found",
  description = "There is nothing to show here right now.",
  action,
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-violet-200 bg-violet-50 p-8 text-center">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}