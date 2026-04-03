import MainLayout from "../components/layout/MainLayout";

const bookings = [1, 2, 3];

export default function MyBookingsPage() {
  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">My Bookings</h1>
            <p className="mt-2 text-slate-600">Manage upcoming and completed journeys.</p>
          </div>
          <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            3 Total Tickets
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {bookings.map((item) => (
            <div key={item} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Cochin → Bangalore</h2>
                  <p className="mt-1 text-sm text-slate-500">Seat 7, 8 · Premium Travels</p>
                </div>
                <div className="flex gap-3">
                  <button className="rounded-2xl border border-violet-200 px-4 py-2 font-semibold text-violet-700">View Ticket</button>
                  <button className="rounded-2xl bg-violet-700 px-4 py-2 font-semibold text-white">Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}