import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { CalendarDays, Clock, MapPin, Plus, Trash2, MapPinned } from "lucide-react";
import { createTrip, markTripCompleted, cancelTrip } from "../../features/operator/operatorSlice";

const PointsManager = ({ title, points, onChange }) => {
  const addPoint = () => {
    onChange([...points, { name: "", city: "", address: "", landmark: "", time: "", sequence: points.length + 1, extraFare: 0 }]);
  };

  const removePoint = (index) => {
    if (points.length <= 1) return toast.error("At least one point is required");
    const newPoints = points.filter((_, i) => i !== index);
    onChange(newPoints);
  };

  const updatePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    onChange(newPoints);
  };

  return (
    <div className="space-y-4 py-4 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <MapPinned size={16} className="text-blue-500" /> {title}
        </h4>
        <button type="button" onClick={addPoint} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
          <Plus size={14} /> Add Point
        </button>
      </div>
      <div className="space-y-3">
        {points.map((point, idx) => (
          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
            <button type="button" onClick={() => removePoint(idx)} className="absolute -top-2 -right-2 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition">
              <Trash2 size={12} />
            </button>
            <div className="grid grid-cols-2 gap-3 mb-2">
               <input required placeholder="Point Name" className="text-xs p-2 rounded-lg border border-slate-200 outline-none" value={point.name} onChange={e => updatePoint(idx, "name", e.target.value)} />
               <input required placeholder="City" className="text-xs p-2 rounded-lg border border-slate-200 outline-none" value={point.city} onChange={e => updatePoint(idx, "city", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-2">
               <input placeholder="Landmark" className="text-xs p-2 rounded-lg border border-slate-200 outline-none" value={point.landmark} onChange={e => updatePoint(idx, "landmark", e.target.value)} />
               <input required placeholder="Time (e.g. 09:00 PM)" className="text-xs p-2 rounded-lg border border-slate-200 outline-none" value={point.time} onChange={e => updatePoint(idx, "time", e.target.value)} />
               <input required type="number" placeholder="Seq" className="text-xs p-2 rounded-lg border border-slate-200 outline-none" value={point.sequence} onChange={e => updatePoint(idx, "sequence", Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <input placeholder="Full Address" className="text-xs p-2 rounded-lg border border-slate-200 outline-none" value={point.address} onChange={e => updatePoint(idx, "address", e.target.value)} />
               <div className="flex items-center gap-2 bg-white px-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400">Extra (₹)</span>
                  <input type="number" min="0" className="text-xs p-1 w-full outline-none" value={point.extraFare} onChange={e => updatePoint(idx, "extraFare", Number(e.target.value))} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    boardingPoints: [{ name: "", city: "", address: "", landmark: "", time: "", sequence: 1, extraFare: 0 }],
    droppingPoints: [{ name: "", city: "", address: "", landmark: "", time: "", sequence: 1, extraFare: 0 }],
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
    
    // Sort points by sequence before sending
    const payload = {
      ...tripForm,
      seatPrice: Number(tripForm.seatPrice),
      totalSeats: Number(tripForm.totalSeats),
      boardingPoints: [...tripForm.boardingPoints].sort((a, b) => a.sequence - b.sequence),
      droppingPoints: [...tripForm.droppingPoints].sort((a, b) => a.sequence - b.sequence),
    };

    await dispatch(createTrip(payload));
    setTripForm({
      busId: buses.length === 1 ? buses[0]._id : "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      journeyDate: "",
      seatPrice: "",
      totalSeats: "40",
      boardingPoints: [{ name: "", city: "", address: "", landmark: "", time: "", sequence: 1, extraFare: 0 }],
      droppingPoints: [{ name: "", city: "", address: "", landmark: "", time: "", sequence: 1, extraFare: 0 }],
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <form onSubmit={submitTrip} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
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
                   
                   <PointsManager 
                     title="Boarding Points" 
                     points={tripForm.boardingPoints} 
                     onChange={(pts) => setTripForm(s => ({ ...s, boardingPoints: pts }))} 
                   />
                   
                   <PointsManager 
                     title="Dropping Points" 
                     points={tripForm.droppingPoints} 
                     onChange={(pts) => setTripForm(s => ({ ...s, droppingPoints: pts }))} 
                   />

                   <button disabled={loading} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition active:scale-95 disabled:opacity-50 mt-4">Publish Trip</button>
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
                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded bg-indigo-50 text-indigo-600`}>{trip.tripStatus}</span>
                         </div>
                         <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest italic">{new Date(trip.journeyDate).toDateString()}</p>
                         <div className="mt-2 text-xs flex gap-4 text-slate-500">
                            <span>{trip.boardingPoints?.length || 0} Boarding</span>
                            <span>{trip.droppingPoints?.length || 0} Dropping</span>
                         </div>
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
