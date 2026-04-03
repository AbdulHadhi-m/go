import {
  ShieldCheck,
  Clock3,
  BadgePercent,
} from "lucide-react";
import WhyChooseCard from "./WhyChooseCard";

const whyChooseItems = [
  {
    id: 1,
    title: "Safe & Secure",
    icon: ShieldCheck,
    description:
      "Your safety is our top priority. All our partner operators are verified and follow strict safety protocols.",
    points: ["Verified operators", "Safety protocols", "24/7 support"],
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Punctual Service",
    icon: Clock3,
    description:
      "We understand the value of your time. Our buses are known for punctuality and reliability.",
    points: ["On-time departure", "Live updates", "Real-time tracking"],
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Best Prices",
    icon: BadgePercent,
    description:
      "Get the best deals and discounts on bus tickets with competitive fares and cashback offers.",
    points: ["Competitive prices", "Regular discounts", "Cashback offers"],
    image:
      "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-slate-100/70 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h2 className="text-4xl font-extrabold text-slate-900">
            Why Choose GoPath?
          </h2>
          <p className="max-w-2xl text-lg text-slate-600">
            Discover the advantages of booking with India&apos;s trusted bus booking platform.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {whyChooseItems.map((item) => (
            <WhyChooseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}