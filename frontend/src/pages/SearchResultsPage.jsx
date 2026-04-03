import MainLayout from "../components/layout/MainLayout";

const buses = [1, 2, 3, 4];

export default function SearchResultsPage() {
  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-[2rem] bg-white p-5 shadow-lg ring-1 ring-violet-100">
          <div className="grid gap-4 md:grid-cols-5">
            <input className="rounded-2xl border border-violet-100 px-4 py-3" placeholder="From" />
            <input className="rounded-2xl border border-violet-100 px-4 py-3" placeholder="To" />
            <input className="rounded-2xl border border-violet-100 px-4 py-3" placeholder="Date" />
            <select className="rounded-2xl border border-violet-100 px-4 py-3">
              <option>Sort by Price</option>
            </select>
            <button className="rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white">Update Search</button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-violet-100">
            <h3 className="text-lg font-bold">Filters</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-violet-50 p-4">AC / Non AC</div>
              <div className="rounded-2xl bg-violet-50 p-4">Sleeper / Seater</div>
              <div className="rounded-2xl bg-violet-50 p-4">Departure Time</div>
            </div>
          </aside>

          <div className="space-y-5">
            {buses.map((item) => (
              <div key={item} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Premium Travels AC Sleeper</h2>
                    <p className="mt-1 text-sm text-slate-500">Cochin → Bangalore</p>
                  </div>
                  <div className="grid gap-5 text-sm md:grid-cols-4 md:items-center">
                    <div>
                      <p className="font-semibold">10:30 PM</p>
                      <p className="text-slate-500">Departure</p>
                    </div>
                    <div>
                      <p className="font-semibold">06:15 AM</p>
                      <p className="text-slate-500">Arrival</p>
                    </div>
                    <div>
                      <p className="font-semibold text-violet-700">₹799</p>
                      <p className="text-slate-500">12 seats left</p>
                    </div>
                    <button className="rounded-2xl bg-violet-700 px-4 py-3 font-semibold text-white">
                      View Seats
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}