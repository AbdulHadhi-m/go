import React from "react";

export default function Reports({ routeAnalytics = [] }) {
  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routeAnalytics.map(row => (
             <div key={row.route} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{row.route}</h4>
                   <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-6">Route Performance</p>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
                      <span className="font-black text-2xl text-emerald-600">{row.averageOccupancy}%</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl text-center">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Completed</p>
                         <p className="font-black text-lg text-slate-700">{row.completedTrips}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Trips</p>
                        <p className="font-black text-lg text-slate-700">{row.trips}</p>
                      </div>
                   </div>
                </div>
             </div>
          ))}
          {routeAnalytics.length === 0 && (
             <div className="col-span-full p-12 text-center text-slate-400">
               No route analytics available yet.
             </div>
          )}
       </div>
    </div>
  );
}
