export default function GovernmentBusCard({ bus }) {
  return (
    <div className="group flex h-full min-h-[220px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
      {/* Logo wrapper */}
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-orange-50 ring-1 ring-slate-200 transition group-hover:scale-105">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
          <img
            src={bus.logo}
            alt={bus.name}
            className="h-12 w-12 object-contain"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/80?text=Bus";
            }}
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-slate-900">{bus.name}</h3>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
        {bus.description}
      </p>
    </div>
  );
}