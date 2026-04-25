export default function RefundPolicyPage() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-cyan-50 px-4 py-20">
      <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] sm:p-16">
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-500">
          Legal
        </div>
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Refund Policy
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-slate-600 sm:text-lg">
          <p>
            Refunds for successfully cancelled tickets are processed automatically by our system upon cancellation confirmation.
          </p>
          <p>
            The applicable refund amount, after any cancellation deductions, will be credited back to your original payment method. Please allow <span className="font-bold text-slate-800">5-7 business days</span> for the funds to reflect in your account.
          </p>
          <p>
            If you do not receive your refund within this timeframe, please reach out to our support team at <span className="font-bold text-slate-800">support@gopath.com</span> with your Booking ID and Cancellation ID for further assistance.
          </p>
          <p className="mt-8 text-sm text-slate-400">
            This is a project/demo policy page. Replace with your official refund policy before production use.
          </p>
        </div>
      </div>
    </div>
  );
}
