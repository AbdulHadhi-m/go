import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Bus, PlusCircle } from "lucide-react";
import { createBus } from "../../features/operator/operatorSlice";

export default function Fleet({ buses = [], loading }) {
  const dispatch = useDispatch();
  const [busForm, setBusForm] = useState({ name: "", busNumber: "", type: "AC Sleeper" });

  const submitBus = async (e) => {
    e.preventDefault();
    if (!busForm.name.trim() || !busForm.busNumber.trim()) {
      toast.error("Bus name and bus number are required");
      return;
    }
    await dispatch(createBus(busForm));
    setBusForm({ name: "", busNumber: "", type: "AC Sleeper" });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <form onSubmit={submitBus} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-6">
                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2"><PlusCircle className="text-blue-500" size={20}/> Register New Bus</h3>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Official Bus Name</label>
                      <input required className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Dreamliner X1" value={busForm.name} onChange={(e) => setBusForm((s) => ({ ...s, name: e.target.value }))} />
                   </div>
                   <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Registration Number</label>
                      <input required className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. KL-01-AB-1234" value={busForm.busNumber} onChange={(e) => setBusForm((s) => ({ ...s, busNumber: e.target.value }))} />
                   </div>
                   <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Coach Type</label>
                      <select className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" value={busForm.type} onChange={(e) => setBusForm((s) => ({ ...s, type: e.target.value }))}>
                         <option>AC Sleeper</option>
                         <option>Non-AC Seater</option>
                         <option>A/C Seater / Sleeper</option>
                         <option>Luxury Volvo</option>
                      </select>
                   </div>
                   <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 mt-4">Add to fleet</button>
                </div>
             </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
             {buses.map(b => (
               <div key={b._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <Bus size={28}/>
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 text-lg">{b.name}</h4>
                        <p className="text-xs font-bold text-blue-500 tracking-widest uppercase">{b.busNumber}</p>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">{b.type}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Capabilities</p>
                     <div className="flex gap-2">
                        <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-lg">{b.totalSeats || 40} SEATS</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">ACTIVE</span>
                     </div>
                  </div>
               </div>
             ))}
             {buses.length === 0 && <p className="text-center text-slate-500 pt-10">No buses in fleet.</p>}
          </div>
       </div>
    </div>
  );
}
