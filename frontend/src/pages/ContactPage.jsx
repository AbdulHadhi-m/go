export default function ContactPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-cyan-50 px-4 py-20">
      <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] sm:p-16">
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-500">
          Company
        </div>
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Contact Us
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-slate-600 sm:text-lg">
          <p>
            We'd love to hear from you! Whether you have a question about bookings, pricing, or our services, our team is ready to answer all your questions.
          </p>
          <ul className="mt-4 space-y-4 rounded-2xl bg-slate-50 p-6 sm:p-8">
            <li className="flex items-center gap-4">
              <span className="font-bold text-slate-800">Email:</span> support@gopath.com
            </li>
            <li className="flex items-center gap-4">
              <span className="font-bold text-slate-800">Phone:</span> +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-4">
              <span className="font-bold text-slate-800">Address:</span> 123 GoPath Street, Tech City, TC 12345
            </li>
          </ul>
          <p className="mt-8 text-sm text-slate-400">
            This is a project/demo contact page. Replace with your official contact details before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
