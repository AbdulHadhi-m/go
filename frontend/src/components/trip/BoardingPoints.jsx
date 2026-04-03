export default function BoardingPoints({
  boarding = [],
  dropping = [],
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      
      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
        <h3 className="text-lg font-bold text-slate-900">Boarding Points</h3>

        <div className="mt-4 space-y-3">
          {boarding.map((point, i) => (
            <div key={i} className="rounded-2xl bg-violet-50 p-4 text-sm">
              {point}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
        <h3 className="text-lg font-bold text-slate-900">Dropping Points</h3>

        <div className="mt-4 space-y-3">
          {dropping.map((point, i) => (
            <div key={i} className="rounded-2xl bg-violet-50 p-4 text-sm">
              {point}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}