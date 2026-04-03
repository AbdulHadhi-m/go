import MainLayout from "../components/layout/MainLayout";

const seats = Array.from({ length: 24 }, (_, i) => i + 1);
const booked = [2, 5, 9, 13, 20];
const selected = [7, 8];

export default function SeatSelectionPage() {
  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <div className="mb-6 flex flex-wrap gap-4 text-sm">
              <span className="rounded-full bg-violet-100 px-4 py-2 text-violet-700">Available</span>
              <span className="rounded-full bg-violet-700 px-4 py-2 text-white">Selected</span>
              <span className="rounded-full bg-slate-200 px-4 py-2 text-slate-700">Booked</span>
            </div>

            <div className="grid grid-cols-4 gap-4 md:grid-cols-6">
              {seats.map((seat) => {
                const isBooked = booked.includes(seat);
                const isSelected = selected.includes(seat);
                return (
                  <button
                    key={seat}
                    className={`rounded-2xl px-4 py-5 text-sm font-semibold transition ${
                      isBooked
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : isSelected
                        ? "bg-violet-700 text-white"
                        : "border border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100"
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <h2 className="text-2xl font-bold">Booking Summary</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex justify-between"><span>Route</span><span>Cochin → Bangalore</span></div>
              <div className="flex justify-between"><span>Seats</span><span>7, 8</span></div>
              <div className="flex justify-between"><span>Fare</span><span>₹1598</span></div>
            </div>
            <button className="mt-8 w-full rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white">
              Continue to Checkout
            </button>
          </aside>
        </div>
      </section>
    </MainLayout>
  );
}