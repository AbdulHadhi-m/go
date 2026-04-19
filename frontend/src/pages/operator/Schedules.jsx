import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { createTrip, markTripCompleted, cancelTrip } from "../../features/operator/operatorSlice";

export default function Schedules({ buses = [], trips = [], loading }) {
  const dispatch = useDispatch();

  const [tripForm, setTripForm] = useState({
    busId: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    journeyDate: "",
    seatPrice: "",
    totalSeats: "40",
  });

  useEffect(() => {
    if (buses.length === 1 && !tripForm.busId) {
      setTripForm((s) => ({ ...s, busId: buses[0]._id }));
    }
  }, [buses, tripForm.busId]);

  const submitTrip = async (e) => {
    e.preventDefault();
    if (!tripForm.busId) {
      toast.error("Please select a bus");
      return;
    }
    await dispatch(createTrip({
      ...tripForm,
      seatPrice: Number(tripForm.seatPrice),
      totalSeats: Number(tripForm.totalSeats)
    }));
    setTripForm({
      busId: buses.length === 1 ? buses[0]._id : "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      journeyDate: "",
      seatPrice: "",
      totalSeats: "40",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <form onSubmit={submitTrip} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-6">
                <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2"><CalendarDays className="text-purple-500" size={20}/> Schedule New Trip</h3>
                <div className="space-y-4">
                   <select required className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none transition" value={tripForm.busId} onChange={(e) => setTripForm((s) => ({ ...s, busId: e.target.value }))}>
                      <option value="">Select bus fleet</option>
                      {buses.map((bus) => (<option key={bus._id} value={bus._id}>{bus.name} ({bus.busNumber})</option>))}
                   </select>
                   <div className="grid grid-cols-2 gap-4">
                      <input required className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none transition" placeholder="From" value={tripForm.from} onChange={(e) => setTripForm((s) => ({ ...s, from: e.target.value }))} />
                      <input required className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none transition" placeholder="To" value={tripForm.to} onChange={(e) => setTripForm((s) => ({ ...s, to: e.target.value }))} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <input required className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none transition" placeholder="Dep Time (09:00 PM)" value={tripForm.departureTime} onChange={(e) => setTripForm((s) => ({ ...s, departureTime: e.target.value }))} />
                      <input required className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none transition" placeholder="Arr Time (06:30 AM)" value={tripForm.arrivalTime} onChange={(e) => setTripForm((s) => ({ ...s, arrivalTime: e.target.value }))} />
                   </div>
                   <input required type="date" className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none transition" value={tripForm.journeyDate} onChange={(e) => setTripForm((s) => ({ ...s, journeyDate: e.target.value }))} />
                   <input required min="1" type="number" className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none transition" placeholder="Price per seat (₹)" value={tripForm.seatPrice} onChange={(e) => setTripForm((s) => ({ ...s, seatPrice: e.target.value }))} />
                   <button disabled={loading} className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition active:scale-95 disabled:opacity-50 mt-4">Publish Trip</button>
                </div>
             </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
             {trips.length === 0 && <div className="p-12 text-center text-slate-400 bg-white border border-dashed border-slate-300 rounded-[2rem]">No trips scheduled yet.</div>}
             {trips.map((trip) => (
               <div key={trip._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
                  <div className="flex items-center gap-6">
                     <div className="flex flex-col items-center">
                        <Clock className="text-indigo-400" size={20}/>
                        <div className="w-[1px] h-8 bg-slate-200 my-1"></div>
                        <MapPin className="text-red-400" size={20}/>
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h4 className="font-black text-slate-800 text-lg">{trip.from} to {trip.to}</h4>
                           <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded bg-indigo-50 text-indigo-600`}>{trip.status}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest italic">{new Date(trip.journeyDate).toDateString()}</p>
                        <p className="text-xs font-black text-indigo-500 mt-2">{trip.departureTime} Departure — {trip.arrivalTime} Arrival</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition" onClick={() => dispatch(markTripCompleted(trip._id))}>MARK COMPLETE</button>
                     <button className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-xs font-black text-rose-600 hover:bg-rose-600 hover:text-white transition" onClick={() => dispatch(cancelTrip({ tripId: trip._id, reason: "Cancelled by operator" }))}>CANCEL</button>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}
