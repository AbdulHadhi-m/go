export default function GovernmentBusCard({ bus }) {
  return (
    <div className="min-w-[170px] rounded-2xl bg-white p-4 text-center shadow-sm">
      <img
        src={bus.logo}
        alt={bus.name}
        className="mx-auto h-14 w-14 rounded-full object-cover"
      />
      <h3 className="mt-4 text-xl font-bold text-slate-900">{bus.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{bus.fullName}</p>
    </div>
  );
}