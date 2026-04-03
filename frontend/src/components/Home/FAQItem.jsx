export default function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-2xl font-semibold text-slate-900">
          {item.question}
        </span>
        <span className="text-2xl text-slate-500">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div className="pb-6 text-lg text-slate-600">{item.answer}</div>
      ) : null}
    </div>
  );
}