const stats = [
  { id: 1, title: "RSRTC Official Partner", subtitle: "" },
  { id: 2, title: "5 Lakhs+ Happy Customers", subtitle: "" },
  { id: 3, title: "3.5L+ Bus Services", subtitle: "" },
  { id: 4, title: "24×7 Customer Support", subtitle: "" },
];

export default function StatsHighlightSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h2 className="mb-10 text-center text-4xl font-extrabold text-slate-900">
        Why choose GoPath
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="rounded-[2rem] bg-sky-50 p-8 text-center shadow-sm"
          >
            <div className="mb-6 text-5xl">🚌</div>
            <h3 className="text-2xl font-extrabold text-slate-800">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}