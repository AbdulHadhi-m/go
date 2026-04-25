export default function HelpCenterPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-cyan-50 px-4 py-20">
      <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] sm:p-16">
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-500">
          Support
        </div>
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Help Center
        </h1>
        <div className="space-y-8 text-base leading-relaxed text-slate-600 sm:text-lg">
          <div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">How do I book a ticket?</h3>
            <p>You can book a ticket by searching for your route on our home page, selecting a bus, choosing your preferred seats from the seat map, and completing the checkout process using our secure payment gateway.</p>
          </div>
          <div className="h-px w-full bg-slate-100"></div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">How do I view my tickets?</h3>
            <p>Once logged in, navigate to the "My Bookings" section in your account dashboard. There, you can view all your past trips and upcoming journeys, along with the detailed PNR and seat information.</p>
          </div>
          <p className="mt-8 text-sm text-slate-400">
            This is a project/demo help center page. Replace with your official FAQs before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
