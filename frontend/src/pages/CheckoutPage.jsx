import MainLayout from "../components/layout/MainLayout";

export default function CheckoutPage() {
  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <h1 className="text-3xl font-extrabold">Passenger Details</h1>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-violet-100 px-4 py-3" placeholder="Full name" />
              <input className="rounded-2xl border border-violet-100 px-4 py-3" placeholder="Phone number" />
              <input className="rounded-2xl border border-violet-100 px-4 py-3" placeholder="Email" />
              <input className="rounded-2xl border border-violet-100 px-4 py-3" placeholder="Age" />
            </div>

            <div className="mt-8 rounded-3xl bg-violet-50 p-5">
              <h2 className="text-lg font-bold">Payment Method</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <button className="rounded-2xl border border-violet-200 bg-white px-4 py-3">UPI</button>
                <button className="rounded-2xl border border-violet-200 bg-white px-4 py-3">Card</button>
                <button className="rounded-2xl border border-violet-200 bg-white px-4 py-3">Wallet</button>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <h2 className="text-2xl font-bold">Fare Summary</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex justify-between"><span>Base Fare</span><span>₹1598</span></div>
              <div className="flex justify-between"><span>Tax</span><span>₹80</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-₹100</span></div>
              <div className="border-t pt-4 text-base font-bold text-slate-900 flex justify-between"><span>Total</span><span>₹1578</span></div>
            </div>
            <button className="mt-8 w-full rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white">
              Pay Now
            </button>
          </aside>
        </div>
      </section>
    </MainLayout>
  );
}