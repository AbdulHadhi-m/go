import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ChevronDown } from "lucide-react";
import FavoriteButton from "../common/FavoriteButton";

export default function BusCard({ bus }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 mb-4 transition hover:shadow-md">
      <div className="p-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          <div className="flex-1 relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-900 truncate" title={bus.busName || bus.name || "Unknown Bus"}>
              {bus.busName || bus.name || "Unknown Bus"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 truncate">{bus.busType || bus.type || "A/C Seater / Sleeper"}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded bg-[#01b559] px-2 py-0.5 text-xs font-bold text-white">
                <span>4.9/5</span>
              </div>
              <p className="text-xs font-medium text-[#01b559]">
                ★ People choice for • New Bus
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center text-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{bus.departureTime}</h3>
              <p className="text-sm text-slate-500">{bus.from}</p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center px-4">
            <p className="text-sm text-slate-400">8h 45m</p>
            <div className="w-32 h-[2px] bg-slate-200 mt-2 relative">
                <div className="absolute -left-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                <div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-200 bg-white"></div>
            </div>
          </div>

          <div className="flex-1 flex justify-center text-center">
            <div>
              <p className="text-xs text-slate-500">19th Apr</p>
              <h3 className="text-2xl font-bold text-slate-900">{bus.arrivalTime}</h3>
              <p className="text-sm text-slate-500">{bus.to}</p>
            </div>
          </div>

          <div className="flex-1 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-1">₹ {bus.fare || bus.price || 900}</h2>
          </div>

          <div className="flex-1 flex flex-col items-end">
            <p className="text-sm text-slate-600 flex items-center gap-1">13 window seats <ShieldCheck size={14} className="text-slate-400" /></p>
            <p className="text-sm font-medium text-slate-500 mb-2">Total {bus.availableSeats || 19} seats left</p>
            <Link 
              to={`/trip/${bus.id || bus._id}`}
              className="rounded px-6 py-2 text-sm font-bold text-white shadow-sm transition-all bg-[#ff7043] hover:bg-[#eb6136]"
            >
              SELECT SEAT
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 justify-between border-t border-slate-100 pt-4 items-center">
          <Link to={`/trip/${bus.id || bus._id}`} className="text-sm font-medium text-blue-600 hover:underline">Boarding & Dropping Points</Link>
          <div className="flex items-center gap-3">
             <FavoriteButton trip={{ _id: bus._id || bus.id, from: bus.from, to: bus.to, journeyDate: bus.journeyDate }} />
             <Link to={`/trip/${bus.id || bus._id}`} className="text-sm font-medium text-blue-600 hover:underline flex items-center">Amenities, Policies & Bus Details <ChevronDown size={14} className="ml-1" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}