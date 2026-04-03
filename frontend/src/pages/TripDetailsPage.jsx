import MainLayout from "../components/layout/MainLayout";

export default function TripDetailsPage() {
  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">Trip Details</span>
              <h1 className="mt-4 text-3xl font-extrabold">Premium Travels AC Sleeper</h1>
              <p className="mt-2 text-slate-600">Cochin → Bangalore · 10:30 PM to 06:15 AM</p>
            </div>
            <div className="rounded-3xl bg-violet-50 p-5">
              <p className="text-sm text-slate-500">Starting from</p>
              <h2 className="mt-1 text-3xl font-bold text-violet-700">₹799</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-violet-50 p-5">Amenities: AC, Charging, Blankets, Water Bottle</div>
            <div className="rounded-3xl bg-violet-50 p-5">Boarding: Vyttila Hub · 10:00 PM</div>
            <div className="rounded-3xl bg-violet-50 p-5">Dropping: Madiwala · 06:15 AM</div>
          </div>

          <button className="mt-8 rounded-2xl bg-violet-700 px-6 py-3 font-semibold text-white">
            Continue to Seat Selection
          </button>
        </div>
      </section>
    </MainLayout>
  );
}