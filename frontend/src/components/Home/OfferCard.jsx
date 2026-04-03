export default function OfferCard({ offer }) {
  return (
    <div className="min-w-[280px] rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm">
      <span className="inline-block rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
        {offer.type}
      </span>

      <h3 className="mt-4 text-2xl font-bold text-slate-900">
        {offer.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">{offer.validity}</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">
          {offer.code}
        </div>

        {offer.image ? (
          <img
            src={offer.image}
            alt={offer.title}
            className="h-20 w-28 rounded-xl object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}