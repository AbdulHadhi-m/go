export default function CancellationPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-cyan-50 px-4 py-20">
      <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] sm:p-16">
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-500">
          Legal
        </div>
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Cancellation Policy
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-slate-600 sm:text-lg">
          <p>
            We understand that plans can change. Tickets booked on GoPath can be cancelled up to 4 hours before the scheduled departure time.
          </p>
          <p>Cancellation charges apply depending on when you cancel your ticket relative to the departure time:</p>
          <ul className="list-disc space-y-3 pl-5 text-slate-700">
            <li><span className="font-bold text-slate-800">More than 24 hours</span> before departure: 10% deduction.</li>
            <li><span className="font-bold text-slate-800">Between 12 to 24 hours</span> before departure: 20% deduction.</li>
            <li><span className="font-bold text-slate-800">Between 4 to 12 hours</span> before departure: 50% deduction.</li>
            <li><span className="font-bold text-slate-800">Less than 4 hours</span> before departure: No cancellation allowed.</li>
          </ul>
          <p className="mt-8 text-sm text-slate-400">
            This is a project/demo policy page. Replace with your official cancellation policy before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
