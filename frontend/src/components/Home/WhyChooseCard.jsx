import { CheckCircle2 } from "lucide-react";

export default function WhyChooseCard({ item }) {
  const Icon = item.icon; // VERY IMPORTANT

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-slate-200">
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-6">
        {/* ICON */}
        <div className="mb-4 inline-flex rounded-2xl bg-red-50 p-3 text-red-500">
          {Icon && <Icon size={26} />}
        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          {item.title}
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          {item.description}
        </p>

        <ul className="mt-5 space-y-3">
          {item.points.map((point, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <CheckCircle2 size={18} className="text-green-500" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}