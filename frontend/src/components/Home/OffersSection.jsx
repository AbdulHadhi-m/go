import OfferCard from "./OfferCard";

const offers = [
  {
    id: 1,
    type: "Bus",
    title: "Save up to ₹500 on first booking",
    validity: "Valid till 30 Apr",
    code: "FIRST500",
    image: "https://st.redbus.in/Images/INDOFFER/FESTIVE300/Desktop.png",
  },
  {
    id: 2,
    type: "Bus",
    title: "Save up to ₹300 with bank cards",
    validity: "Valid till 31 Mar",
    code: "CARD300",
    image: "https://i.pinimg.com/1200x/03/e9/33/03e933839a499323f1d5f8b29c47a5ed.jpg",
  },
  {
    id: 3,
    type: "Bus",
    title: "Wedding special bus deals",
    validity: "Limited period offer",
    code: "WEDDING",
    image: "https://i.pinimg.com/1200x/93/bc/31/93bc31a2a1d6711e1202c475e0d65e90.jpg",
  },
];

export default function OffersSection() {
  return (
    <section className="relative z-30 mx-auto -mt-10 max-w-7xl px-4 py-14 md:-mt-14 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-extrabold text-slate-900">
          Bus Booking Discount Offers
        </h2>
        <button className="text-lg font-semibold text-violet-700">
          View All
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}