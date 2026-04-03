export default function InfoContentSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <h2 className="text-5xl font-extrabold text-slate-900">
        Book Bus Ticket Online With GoPath
      </h2>

      <p className="mt-8 text-xl leading-10 text-slate-600">
        GoPath is a trusted platform for online bus ticket booking, making intercity travel simple,
        convenient, and affordable. Search routes, compare prices, select seats, and confirm tickets in minutes.
      </p>

      <p className="mt-8 text-xl leading-10 text-slate-600">
        Booking a bus ticket online on GoPath is quick and hassle-free. Compare buses, fares, reviews,
        amenities, boarding points, and dropping points with a smooth premium UI.
      </p>

      <div className="mt-16">
        <h3 className="text-4xl font-extrabold uppercase text-slate-900">
          How to book bus tickets online with GoPath?
        </h3>

        <ul className="mt-8 list-disc space-y-4 pl-8 text-xl leading-9 text-slate-700">
          <li>Search your route by entering departure, destination, and travel date.</li>
          <li>Compare bus timings, ticket prices, and amenities.</li>
          <li>Select your preferred seat from the seat layout.</li>
          <li>Complete secure payment using UPI, card, or wallet.</li>
          <li>Get your e-ticket instantly.</li>
        </ul>
      </div>
    </section>
  );
}