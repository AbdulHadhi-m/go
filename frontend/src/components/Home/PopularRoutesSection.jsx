import RouteCard from "./RouteCard";

const routes = [
  {
    id: 1,
    city: "Delhi",
    destinations: ["Manali", "Chandigarh", "Jaipur"],
  },
  {
    id: 2,
    city: "Mumbai",
    destinations: ["Goa", "Pune", "Bangalore"],
  },
  {
    id: 3,
    city: "Chennai",
    destinations: ["Coimbatore", "Pondicherry", "Bangalore"],
  },
  {
    id: 4,
    city: "Bangalore",
    destinations: ["Mumbai", "Hyderabad", "Chennai"],
  },
];

export default function PopularRoutesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h2 className="mb-8 text-4xl font-extrabold text-slate-900">
        Popular Bus Routes
      </h2>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </section>
  );
}