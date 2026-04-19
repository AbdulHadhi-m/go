import React from "react";
import { useDispatch } from "react-redux";
import { Ban, CheckCircle } from "lucide-react";
import { toggleUserBlock } from "../../features/admin/adminSlice";

export default function Users({ users }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
          <thead className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-100 text-xs tracking-wider uppercase">
            <tr>
               <th className="p-5">User</th>
               <th className="p-5">Email</th>
               <th className="p-5">Role</th>
               <th className="p-5">Status</th>
               <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-slate-50/50 transition">
                <td className="p-5">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                     </div>
                     <span className="font-bold text-slate-900">{u.firstName} {u.lastName}</span>
                     {u.role === 'admin' && <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] uppercase font-black rounded">Admin</span>}
                   </div>
                </td>
                <td className="p-5 font-medium">{u.email}</td>
                <td className="p-5"><span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-lg font-bold uppercase tracking-wider">{u.role}</span></td>
                <td className="p-5">
                   {u.isBlocked ? <span className="text-rose-600 flex items-center gap-1.5 text-xs font-bold"><Ban size={14}/> Blocked</span> : <span className="text-emerald-600 flex items-center gap-1.5 text-xs font-bold"><CheckCircle size={14}/> Active</span>}
                </td>
                <td className="p-5 text-right flex justify-end gap-2">
                   <button 
                     onClick={() => dispatch(toggleUserBlock(u._id))} 
                     disabled={u.role === "admin"}
                     className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${u.isBlocked ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'}`}
                   >
                      {u.isBlocked ? 'Unblock Access' : 'Suspend'}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
