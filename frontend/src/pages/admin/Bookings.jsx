import React from "react";

export default function Bookings({ bookings }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
          <thead className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-100 text-xs tracking-wider uppercase">
            <tr>
               <th className="p-5">Tx Code</th>
               <th className="p-5">Customer</th>
               <th className="p-5">Itinerary</th>
               <th className="p-5">Date</th>
               <th className="p-5">Finances</th>
               <th className="p-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">No bookings found.</td>
              </tr>
            )}
            {bookings.map(b => (
              <tr key={b._id} className="hover:bg-slate-50/50 transition">
                <td className="p-5 font-mono text-[10px] text-slate-400 font-bold tracking-wider">{b._id.slice(-8)}</td>
                <td className="p-5 font-bold text-slate-900">{b.user?.firstName || 'Guest'} {b.user?.lastName}</td>
                <td className="p-5 font-medium">{b.trip?.from} <span className="text-slate-400">→</span> {b.trip?.to}</td>
                <td className="p-5 text-xs font-semibold text-slate-500">{new Date(b.createdAt || Date.now()).toLocaleDateString()}</td>
                <td className="p-5 font-black text-emerald-600 text-base">₹{b.finalAmount || b.totalAmount}</td>
                <td className="p-5 text-right">
                   <span className={`px-3 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-lg ${b.paymentStatus === 'completed' || b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {b.status || b.paymentStatus || 'Pending'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
