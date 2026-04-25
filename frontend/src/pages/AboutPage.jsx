export default function AboutPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-cyan-50 px-4 py-20">
      <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] sm:p-16">
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-500">
          Company
        </div>
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          About Us
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-slate-600 sm:text-lg">
          <p>
            GoPath is a premium bus ticket booking experience designed to offer a smooth
            user interface and a fast booking flow. We store your account information (name, email)
            and booking history to provide features like seamless checkouts and user profiles.
          </p>
          <p>
            Our mission is to simplify bus travel and make it accessible to everyone
            with reliable services and excellent customer support. We do not sell your personal information.
          </p>
          <p className="mt-8 text-sm text-slate-400">
            This is a project/demo page. Replace with your official information before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
