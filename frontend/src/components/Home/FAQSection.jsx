import { useState } from "react";
import FAQItem from "./FAQItem";

const faqData = [
  {
    question: "Why are GoPath tickets cheaper?",
    answer: "We work directly with operators and pass on savings to you.",
  },
  {
    question: "Do all platforms have the same buses?",
    answer: "No. Inventory and operator partnerships may differ from platform to platform.",
  },
  {
    question: "Do I need an account to book bus tickets?",
    answer: "You can browse buses without login, but an account helps manage bookings and tickets.",
  },
  {
    question: "Can I avail discounts on bus tickets?",
    answer: "Yes, you can use coupons, festive offers, and partner bank deals.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <h2 className="mb-10 text-5xl font-extrabold text-green-700">FAQ</h2>

      <div className="rounded-[2rem] bg-white px-6 shadow-sm ring-1 ring-slate-100">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex(openIndex === index ? -1 : index)
            }
          />
        ))}
      </div>
    </section>
  );
}