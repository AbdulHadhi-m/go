export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
      <p className="mt-3 text-sm text-slate-500">{text}</p>
    </div>
  );
}