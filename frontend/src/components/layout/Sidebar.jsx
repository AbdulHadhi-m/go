export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 rounded-3xl border border-violet-100 bg-white p-5 shadow-sm xl:block">
      <h3 className="text-lg font-bold text-slate-900">Quick Menu</h3>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-violet-50 p-3">Upcoming Trips</div>
        <div className="rounded-2xl bg-violet-50 p-3">Saved Routes</div>
        <div className="rounded-2xl bg-violet-50 p-3">Offers & Wallet</div>
      </div>
    </aside>
  );
}