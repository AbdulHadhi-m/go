export default function CareersPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-cyan-50 px-4 py-20">
      <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] sm:p-16">
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-500">
          Company
        </div>
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Careers
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-slate-600 sm:text-lg">
          <p>
            Join the GoPath team and help us build the future of bus travel! We are on a mission to modernize and simplify transportation systems globally.
          </p>
          <p>We are currently looking for passionate individuals for the following roles:</p>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>Frontend Engineer (React)</li>
            <li>Backend Engineer (Node.js)</li>
            <li>Customer Support Specialist</li>
          </ul>
          <p>Send your resume and a cover letter to <span className="font-bold text-slate-800">careers@gopath.com</span> to apply.</p>
          <p className="mt-8 text-sm text-slate-400">
            This is a project/demo careers page. Replace with your official job openings before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
