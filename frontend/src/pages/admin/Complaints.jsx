import React from "react";
import { useDispatch } from "react-redux";
import { updateComplaint } from "../../features/admin/adminSlice";

export default function Complaints({ complaints }) {
  const dispatch = useDispatch();

  return (
    <div className="grid gap-4 animate-in fade-in">
       {complaints.length === 0 && <p className="text-slate-500 text-center py-10">No support tickets found.</p>}
       {complaints.map(c => (
         <div key={c._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-6 group hover:border-slate-300 transition">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                 <h4 className="font-extrabold text-slate-900 text-xl">{c.subject}</h4>
                 <span className={`px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg ${c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                    {c.status || "Open"}
                 </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-4xl">{c.message}</p>
            </div>
            <div className="flex gap-2">
               {c.status !== 'resolved' && (
                  <button onClick={() => dispatch(updateComplaint({ complaintId: c._id, status: "in_progress", resolutionNote: "Investigating" }))} className="px-5 py-2.5 bg-white rounded-xl text-sm font-bold transition border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600">Review</button>
               )}
               {c.status !== 'resolved' && (
                  <button onClick={() => dispatch(updateComplaint({ complaintId: c._id, status: "resolved", resolutionNote: "Resolved by admin" }))} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition">Mark Secure</button>
               )}
            </div>
         </div>
       ))}
    </div>
  );
}
