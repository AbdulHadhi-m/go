import GovernmentBusCard from "./GovernmentBusCard";

const govtBuses = [
  {
    id: 1,
    name: "APSRTC",
    fullName: "Andhra Pradesh State Road Transport Corporation",
    logo: "https://via.placeholder.com/60",
  },
  {
    id: 2,
    name: "HRTC",
    fullName: "Himachal Road Transport Corporation",
    logo: "https://via.placeholder.com/60",
  },
  {
    id: 3,
    name: "KSRTC",
    fullName: "Kerala State Road Transport Corporation",
    logo: "https://via.placeholder.com/60",
  },
  {
    id: 4,
    name: "TSRTC",
    fullName: "Telangana State Road Transport Corporation",
    logo: "https://via.placeholder.com/60",
  },
];

export default function GovernmentBusesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h2 className="mb-8 text-4xl font-extrabold text-slate-900">
        Government Buses
      </h2>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {govtBuses.map((bus) => (
          <GovernmentBusCard key={bus.id} bus={bus} />
        ))}
      </div>
    </section>
  );
}