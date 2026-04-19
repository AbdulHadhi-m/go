import React from "react";
import { useDispatch } from "react-redux";
import { Bus, Trash2 } from "lucide-react";
import { deleteAnyBus } from "../../features/admin/adminSlice";

export default function Buses({ buses }) {
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
       {buses.length === 0 && <p className="text-slate-500 col-span-3 text-center py-10">No buses found in the system.</p>}
       {buses.map(b => (
         <div key={b._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 relative overflow-hidden group hover:shadow-md transition">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm"><Bus size={20}/></div>
                 <div>
                   <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{b.name}</h3>
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{b.busNumber}{b.type ? ` • ${b.type}` : ''}</span>
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
               <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center"><span className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Total Seats</span><p className="font-black text-slate-700 text-lg">{b.totalSeats || 'N/A'}</p></div>
               <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center"><span className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Fare Origin</span><p className="font-black text-slate-700 text-lg">{b.fare ? `₹${b.fare}` : 'N/A'}</p></div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
               <span className="text-xs font-semibold text-slate-400">{b.operator ? 'Assigned' : 'Unassigned'}</span>
               <button onClick={() => dispatch(deleteAnyBus(b._id))} className="text-rose-600 hover:text-white font-bold flex items-center gap-1.5 text-xs transition bg-rose-50 hover:bg-rose-600 px-4 py-2 rounded-xl">
                 <Trash2 size={14} /> Remove Bus
               </button>
            </div>
         </div>
       ))}
    </div>
  );
}
