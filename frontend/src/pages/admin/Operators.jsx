import React from "react";
import { useDispatch } from "react-redux";
import { CheckCircle } from "lucide-react";
import { approveOperator, rejectOperator } from "../../features/admin/adminSlice";

export default function Operators({ operators }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
          <thead className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-100 text-xs tracking-wider uppercase">
            <tr>
               <th className="p-5">Operator</th>
               <th className="p-5">Email & Contact</th>
               <th className="p-5">Application Status</th>
               <th className="p-5 text-right">Approvals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {operators.map(u => (
              <tr key={u._id} className="hover:bg-slate-50/50 transition">
                <td className="p-5 font-bold text-slate-900">{u.firstName} {u.lastName}</td>
                <td className="p-5">
                   <div className="flex flex-col">
                      <span className="font-semibold">{u.email}</span>
                      <span className="text-xs text-slate-400">{u.phoneNumber || "No Phone Info"}</span>
                   </div>
                </td>
                <td className="p-5">
                   <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.operatorApplicationStatus === 'pending' ? 'bg-amber-100 text-amber-700' : u.operatorApplicationStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {u.operatorApplicationStatus || u.role}
                   </span>
                </td>
                <td className="p-5 text-right">
                   {u.operatorApplicationStatus === 'pending' && (
                     <div className="flex justify-end gap-2">
                       <button onClick={() => dispatch(approveOperator(u._id))} className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">Approve</button>
                       <button onClick={() => dispatch(rejectOperator({ userId: u._id, reason: "Rejected" }))} className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 transition">Deny</button>
                     </div>
                   )}
                   {u.operatorApplicationStatus === 'approved' && (
                     <span className="text-xs font-bold text-emerald-500 px-4 py-2 flex items-center justify-end gap-1"><CheckCircle size={14}/> Verified</span>
                   )}
                </td>
              </tr>
            ))}
            {operators.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-slate-500 p-8">No operators found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
