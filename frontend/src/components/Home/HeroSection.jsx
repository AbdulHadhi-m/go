// import {
//   MapPin,
//   CalendarDays,
//   Search,
//   ArrowLeftRight,
// } from "lucide-react";

// export default function HeroSection() {
//   return (
//     <section className="w-full bg-slate-100/70 pb-8 md:pb-12">
//       {/* HERO BANNER */}
//       <div className="relative h-[220px] overflow-hidden sm:h-[250px] md:h-[300px]">
//         <img
//           src="/images/bus3.jpg"
//           alt="Bus Hero"
//           className="absolute inset-0 h-full w-full object-cover object-center"
//         />

//         <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-indigo-900/35 to-purple-800/30" />

//         <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 md:px-6">
//           <div className="max-w-2xl">
//             <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl lg:text-5xl">
//               India's No. 1 online
//               <br />
//               bus ticket booking site
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* SEARCH BOX */}
//       <div className="relative z-20 mx-auto -mt-6 max-w-7xl px-4 sm:-mt-8 md:-mt-12 md:px-6 lg:px-8">
//         <div className="rounded-[2rem] bg-white p-4 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 sm:p-5 md:rounded-[3rem] md:p-6">
//           <div className="relative grid gap-4 md:grid-cols-[1.2fr_1.2fr_1fr_auto] md:items-center">
//             {/* FROM */}
//             <div className="flex min-h-[58px] items-center gap-3 rounded-[1.5rem] border border-slate-200 px-4 py-3 transition hover:border-red-400 md:min-h-[64px] md:rounded-[2rem] md:py-4">
//               <MapPin className="shrink-0 text-slate-500" size={20} />
//               <input
//                 type="text"
//                 placeholder="From"
//                 className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
//               />
//             </div>

//             {/* MOBILE SWAP BUTTON */}
//             <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-red-50 shadow-sm transition hover:scale-105 md:hidden">
//               <ArrowLeftRight className="text-slate-600" size={18} />
//             </button>

//             {/* DESKTOP SWAP BUTTON */}
//             <button className="absolute left-[31%] top-1/2 z-30 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-red-100 shadow-lg transition hover:scale-105 md:flex">
//               <ArrowLeftRight className="text-slate-600" size={20} />
//             </button>

//             {/* TO */}
//             <div className="flex min-h-[58px] items-center gap-3 rounded-[1.5rem] border border-slate-200 px-4 py-3 transition hover:border-red-400 md:min-h-[64px] md:rounded-[2rem] md:py-4">
//               <MapPin className="shrink-0 text-slate-500" size={20} />
//               <input
//                 type="text"
//                 placeholder="To"
//                 className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
//               />
//             </div>

//             {/* DATE */}
//             <div className="flex min-h-[58px] items-center gap-3 rounded-[1.5rem] border border-slate-200 px-4 py-3 transition hover:border-red-400 md:min-h-[64px] md:rounded-[2rem] md:py-4">
//               <CalendarDays className="shrink-0 text-slate-500" size={20} />
//               <input
//                 type="date"
//                 className="w-full bg-transparent text-sm font-medium outline-none"
//               />
//             </div>

//             {/* BUTTON */}
//             <button className="flex min-h-[58px] items-center justify-center gap-2 rounded-[1.5rem] bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-600 md:min-h-[64px] md:rounded-[2rem] md:py-4">
//               <Search size={18} />
//               Search
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


import { useState } from "react";
import {
  MapPin,
  CalendarDays,
  Search,
  ArrowLeftRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (formData.from) params.set("from", formData.from);
    if (formData.to) params.set("to", formData.to);
    if (formData.date) params.set("date", formData.date);

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <section className="w-full bg-slate-100/70 pb-8 md:pb-12">
      {/* HERO BANNER */}
      <div className="relative h-[220px] overflow-hidden sm:h-[250px] md:h-[300px]">
        <img
          src="/images/bus3.jpg"
          alt="Bus Hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-indigo-900/35 to-purple-800/30" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 md:px-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl lg:text-5xl">
              India&apos;s No. 1 online
              <br />
              bus ticket booking site
            </h1>
          </div>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="relative z-20 mx-auto -mt-6 max-w-7xl px-4 sm:-mt-8 md:-mt-12 md:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="rounded-[2rem] bg-white p-4 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 sm:p-5 md:rounded-[3rem] md:p-6"
        >
          <div className="relative grid gap-4 md:grid-cols-[1.2fr_1.2fr_1fr_auto] md:items-center">
            {/* FROM */}
            <div className="flex min-h-[58px] items-center gap-3 rounded-[1.5rem] border border-slate-200 px-4 py-3 transition hover:border-red-400 md:min-h-[64px] md:rounded-[2rem] md:py-4">
              <MapPin className="shrink-0 text-slate-500" size={20} />
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="From"
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              />
            </div>

            {/* MOBILE SWAP BUTTON */}
            <button
              type="button"
              onClick={handleSwap}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-red-50 shadow-sm transition hover:scale-105 md:hidden"
            >
              <ArrowLeftRight className="text-slate-600" size={18} />
            </button>

            {/* DESKTOP SWAP BUTTON */}
            <button
              type="button"
              onClick={handleSwap}
              className="absolute left-[31%] top-1/2 z-30 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-red-100 shadow-lg transition hover:scale-105 md:flex"
            >
              <ArrowLeftRight className="text-slate-600" size={20} />
            </button>

            {/* TO */}
            <div className="flex min-h-[58px] items-center gap-3 rounded-[1.5rem] border border-slate-200 px-4 py-3 transition hover:border-red-400 md:min-h-[64px] md:rounded-[2rem] md:py-4">
              <MapPin className="shrink-0 text-slate-500" size={20} />
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="To"
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              />
            </div>

            {/* DATE */}
            <div className="flex min-h-[58px] items-center gap-3 rounded-[1.5rem] border border-slate-200 px-4 py-3 transition hover:border-red-400 md:min-h-[64px] md:rounded-[2rem] md:py-4">
              <CalendarDays className="shrink-0 text-slate-500" size={20} />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="flex min-h-[58px] items-center justify-center gap-2 rounded-[1.5rem] bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-600 md:min-h-[64px] md:rounded-[2rem] md:py-4"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}