export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      ) : null}

      <input
        className={`w-full rounded-2xl border border-red-100 px-4 py-3 outline-none transition focus:border-red-400 ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      ) : null}
    </div>
  );
}