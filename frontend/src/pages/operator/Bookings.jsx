import React from "react";

export default function Bookings({ bookings = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in">
       <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
             <thead className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-100 text-xs tracking-wider uppercase">
                <tr>
                   <th className="p-6">Passenger</th>
                   <th className="p-6">Trip Details</th>
                   <th className="p-6">Seats</th>
                   <th className="p-6">Amount</th>
                   <th className="p-6 text-right">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {bookings.map(b => (
                   <tr key={b._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-6">
                         <p className="font-bold text-slate-900">{b.user?.firstName} {b.user?.lastName}</p>
                         <p className="text-xs text-slate-400 font-semibold">{b.user?.email || 'No email'}</p>
                      </td>
                      <td className="p-6">
                         <p className="font-semibold text-slate-700">{b.trip?.from} → {b.trip?.to}</p>
                         <p className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-6">
                         <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">
                            {b.seats?.join(', ') || 'N/A'}
                         </span>
                      </td>
                      <td className="p-6 font-black text-slate-800">₹{b.finalAmount || b.totalAmount}</td>
                      <td className="p-6 text-right">
                         <span className={`px-2.5 py-1 text-[9px] font-black tracking-widest uppercase rounded-lg bg-emerald-100 text-emerald-700`}>
                            {b.paymentStatus || 'confirmed'}
                         </span>
                      </td>
                   </tr>
                ))}
                {bookings.length === 0 && (
                   <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400 font-bold">No bookings found in system.</td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
}
