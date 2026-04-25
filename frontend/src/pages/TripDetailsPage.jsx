import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCircle2,
  Wifi,
  Droplet,
  Bed,
  PlugZap,
  Film
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { getTripById, getTripSeats } from "../features/trips/tripSlice";

export default function TripDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { trip, seatsData, loading, error } = useSelector((state) => state.trips || {});

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("seats");

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [droppingPoint, setDroppingPoint] = useState(null);

  const [reviewsData, setReviewsData] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "reviews" && trip?.bus && reviewsData.length === 0 && !reviewsLoading) {
      setReviewsLoading(true);
      import("../services/axiosInstance").then((mod) => {
        const axiosInstance = mod.default;
        axiosInstance.get(`/reviews/bus/${typeof trip.bus === 'object' ? trip.bus._id : trip.bus}`)
          .then((res) => {
             setReviewsData(res.data.data || []);
             setReviewsLoading(false);
          })
          .catch((err) => {
             console.error("Error fetching reviews:", err);
             setReviewsLoading(false);
          });
      });
    }
  }, [activeTab, trip?.bus]);

  useEffect(() => {
    dispatch(getTripById(id));
    dispatch(getTripSeats(id));
  }, [dispatch, id]);

  const bookedSeats = seatsData?.bookedSeats || [];

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((item) => item !== seat)
        : [...prev, seat]
    );
  };

  const boardingPointsList = useMemo(() => {
    return [...(trip?.boardingPoints || [])].sort((a, b) => a.sequence - b.sequence);
  }, [trip]);

  const droppingPointsList = useMemo(() => {
    return [...(trip?.droppingPoints || [])].sort((a, b) => a.sequence - b.sequence);
  }, [trip]);

  useEffect(() => {
    if (boardingPointsList.length > 0 && !boardingPoint) setBoardingPoint(boardingPointsList[0]._id);
    if (droppingPointsList.length > 0 && !droppingPoint) setDroppingPoint(droppingPointsList[0]._id);
  }, [boardingPointsList, droppingPointsList, boardingPoint, droppingPoint]);

  const selectedBoardingObj = useMemo(() => boardingPoint ? boardingPointsList.find(p => p._id === boardingPoint) : null, [boardingPoint, boardingPointsList]);
  const selectedDroppingObj = useMemo(() => droppingPoint ? droppingPointsList.find(p => p._id === droppingPoint) : null, [droppingPoint, droppingPointsList]);
  
  const boardingExtra = selectedBoardingObj?.extraFare || 0;
  const droppingExtra = selectedDroppingObj?.extraFare || 0;

  const totalAmount = selectedSeats.length * ((trip?.fare || 0) + boardingExtra + droppingExtra);

  if (loading && !trip) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <p className="text-xl text-gray-500">Loading trip details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !trip) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <p className="text-xl text-red-600">{error || "Trip not found"}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="mx-auto max-w-6xl">
           <Link to="/search-results" className="mb-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
              <ArrowLeft size={16} className="mr-1" /> Back to routes
           </Link>
           
           {/* Main Card */}
           <div className="overflow-hidden bg-white shadow-sm ring-1 ring-slate-200">
              
              {/* Primary Info Row */}
              <div className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900">{trip?.busName || "A1 Travels"}</h2>
                    <p className="mt-1 text-sm text-slate-500">{trip?.busType || "A/C Seater / Sleeper (2+1)"}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded bg-[#01b559] px-2 py-0.5 text-xs font-bold text-white">
                        <span>4.9/5</span>
                      </div>
                      <p className="text-xs font-medium text-[#01b559]">
                        ★ People choice for • New Bus
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center text-center">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{trip?.departureTime || "19:30"}</h3>
                      <p className="text-sm text-slate-500">{trip?.from || "Aristo Junction"}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex flex-col items-center justify-center px-4">
                    <p className="text-sm text-slate-400">8h 45m</p>
                    <div className="w-32 h-[2px] bg-slate-200 mt-2 relative">
                        <div className="absolute -left-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                        <div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-200 bg-white"></div>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center text-center">
                    <div>
                      <p className="text-xs text-slate-500">19th Apr</p>
                      <h3 className="text-2xl font-bold text-slate-900">{trip?.arrivalTime || "04:15"}</h3>
                      <p className="text-sm text-slate-500">{trip?.to || "Malappuram"}</p>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-1">₹ {trip?.fare || 900}</h2>
                  </div>

                  <div className="flex-1 flex flex-col items-end">
                    <p className="text-sm text-slate-600 flex items-center gap-1">13 window seats <ShieldCheck size={14} className="text-slate-400" /></p>
                    <p className="text-sm font-medium text-slate-500 mb-2">Total {trip?.availableSeats || 19} seats left</p>
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="rounded px-6 py-2 text-sm font-bold text-white shadow-sm transition-all bg-[#ff7043] hover:bg-[#eb6136]"
                    >
                      {isExpanded ? "HIDE SEAT" : "SELECT SEAT"}
                    </button>
                  </div>
                </div>

                {!isExpanded && (
                  <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
                    <button className="text-sm font-medium text-blue-600 hover:underline">Boarding & Dropping Points</button>
                    <button className="text-sm font-medium text-blue-600 hover:underline flex items-center">Amenities, Policies & Bus Details <ChevronDown size={14} className="ml-1" /></button>
                  </div>
                )}

                {isExpanded && (
                  <div className="mt-4 text-right">
                    <button onClick={() => setIsExpanded(false)} className="text-sm font-medium text-blue-600 hover:underline flex items-center justify-end w-full">Hide Details <ChevronUp size={14} className="ml-1" /></button>
                  </div>
                )}
              </div>

              {/* Expanded Details Section */}
              {isExpanded && (
                <div className="border-t border-slate-200">
                  <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 md:px-6">
                    {["seats", "amenities", "reviews", "policies", "boarding"].map((tab) => {
                      const labels = {
                        seats: "SELECT SEATS",
                        amenities: "AMENITIES AND PHOTOS",
                        reviews: "REVIEWS & FEEDBACK",
                        policies: "POLICIES",
                        boarding: "BOARDING AND DROPPING"
                      };
                      return (
                        <button 
                          key={tab} 
                          onClick={() => setActiveTab(tab)}
                          className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                            activeTab === tab ? "bg-[#3366cc] text-white" : "text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                            {labels[tab]}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="p-6 bg-slate-50">
                    {activeTab === "seats" && (
                      <div className="grid lg:grid-cols-[400px_1fr] gap-8">
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3366cc] text-xs text-white">1</span>
                            Select boarding and dropping point
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="mb-2 font-medium text-slate-700">Boarding Point</p>
                              <div className="flex flex-col">
                                {boardingPointsList.map((pt, idx) => (
                                    <label key={pt._id} className={`flex cursor-pointer gap-3 border p-3 bg-white transition ${boardingPoint === pt._id ? 'border-blue-500 ring-1 ring-blue-500 z-10' : 'border-slate-200 border-t-0'} ${idx === 0 ? 'border-t rounded-t' : ''} ${idx === boardingPointsList.length - 1 ? 'rounded-b' : ''}`}>
                                      <input type="radio" name="boarding" className="mt-1 w-4 h-4 text-[#3366cc]" checked={boardingPoint === pt._id} onChange={() => setBoardingPoint(pt._id)} />
                                      <div>
                                          <div className="flex items-center justify-between gap-2">
                                              <p className="text-sm font-bold text-slate-900">{pt.time}</p>
                                              {pt.extraFare > 0 && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">+₹{pt.extraFare}</span>}
                                          </div>
                                          <p className="text-sm font-semibold text-slate-800">{pt.name}</p>
                                          <p className="text-xs text-slate-500 mt-1">{pt.landmark} • {pt.city}</p>
                                      </div>
                                    </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="mb-2 font-medium text-slate-700">Dropping Point</p>
                              <div className="flex flex-col">
                                {droppingPointsList.map((pt, idx) => (
                                    <label key={pt._id} className={`flex cursor-pointer gap-3 border p-3 bg-white transition ${droppingPoint === pt._id ? 'border-blue-500 ring-1 ring-blue-500 z-10' : 'border-slate-200 border-t-0'} ${idx === 0 ? 'border-t rounded-t' : ''} ${idx === droppingPointsList.length - 1 ? 'rounded-b' : ''}`}>
                                      <input type="radio" name="dropping" className="mt-1 w-4 h-4 text-[#3366cc]" checked={droppingPoint === pt._id} onChange={() => setDroppingPoint(pt._id)} />
                                      <div className="flex-1">
                                          <div className="flex items-center justify-between gap-2">
                                              <p className="text-sm font-bold text-slate-900">{pt.time}</p>
                                              {pt.extraFare > 0 && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">+₹{pt.extraFare}</span>}
                                          </div>
                                          <p className="text-sm font-semibold text-slate-800">{pt.name}</p>
                                          <p className="text-xs text-slate-500 mt-1">{pt.landmark} • {pt.city}</p>
                                      </div>
                                    </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3366cc] text-xs text-white">2</span>
                            Select your seat
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600">
                            <div className="flex items-center gap-2"><div className="h-4 w-4 bg-slate-200 rounded-sm"></div> Booked</div>
                            <div className="flex items-center gap-2"><div className="h-4 w-4 border border-slate-300 bg-white rounded-sm"></div> Available</div>
                            <div className="flex items-center gap-2"><div className="h-4 w-4 bg-[#e91e63] rounded-sm"></div> Ladies</div>
                            <div className="flex items-center gap-2"><div className="h-4 w-4 bg-[#3366cc] rounded-sm"></div> Men</div>
                            <div className="flex gap-2 w-full mt-2 lg:mt-0 lg:w-auto lg:ml-auto">
                                <button className="bg-[#3366cc] text-white px-3 py-1 text-xs rounded shadow-sm">All</button>
                                <button className="bg-white text-slate-600 px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">₹ 900</button>
                                <button className="bg-white text-slate-600 px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">₹ 1100</button>
                                <button className="bg-white text-slate-600 px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">₹ 1200</button>
                                <button className="bg-white text-slate-600 px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">₹ 1300</button>
                            </div>
                          </div>

                          <div className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-xl border border-slate-200">
                             {(() => {
                                const typeStr = trip?.busType?.toLowerCase() || "";
                                const sleeper = typeStr.includes("sleeper");
                                const seater = typeStr.includes("seater") || (!sleeper && typeStr.includes("ac"));
                                const layout = sleeper && seater ? "mixed" : (sleeper ? "sleeper" : "seater");

                                if (layout === "seater") {
                                  return (
                                    <div className="relative border border-slate-200 rounded-xl p-6 pl-12 flex items-center gap-6">
                                      <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold tracking-widest text-slate-400">FRONT</div>
                                      <div className="flex items-center">
                                          <div className="h-8 w-8 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                              <div className="w-4 h-1 bg-slate-400 rounded-full"></div>
                                          </div>
                                      </div>
                                      <div className="flex w-full flex-col gap-6">
                                        <div className="flex flex-col gap-2 w-full border-r-4 border-slate-100 pr-2">
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 10}).map((_, i) => {
                                                const seat = `S${i+1}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                const isLadies = false;
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-1 rounded transition border-t-[8px] border-b-[4px] border-l-[4px] border-r-0 border-slate-300 rounded-l-md ${isBooked ? (isLadies ? 'bg-[#e91e63]' : 'bg-slate-200 cursor-not-allowed') : isSelected ? 'bg-blue-100 border-[#3366cc]' : 'bg-white hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 10}).map((_, i) => {
                                                const seat = `S${i+11}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                const isLadies = false;
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-1 rounded transition border-t-[8px] border-b-[4px] border-l-[4px] border-r-0 border-slate-300 rounded-l-md ${isBooked ? (isLadies ? 'bg-[#e91e63]' : 'bg-slate-200 cursor-not-allowed') : isSelected ? 'bg-blue-100 border-[#3366cc]' : 'bg-white hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full border-r-4 border-slate-100 pr-2">
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 10}).map((_, i) => {
                                                const seat = `S${i+21}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                const isLadies = false;
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-1 rounded transition border-t-[8px] border-b-[4px] border-l-[4px] border-r-0 border-slate-300 rounded-l-md ${isBooked ? (isLadies ? 'bg-[#e91e63]' : 'bg-slate-200 cursor-not-allowed') : isSelected ? 'bg-blue-100 border-[#3366cc]' : 'bg-white hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 10}).map((_, i) => {
                                                const seat = `S${i+31}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                const isLadies = false;
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-1 rounded transition border-t-[8px] border-b-[4px] border-l-[4px] border-r-0 border-slate-300 rounded-l-md ${isBooked ? (isLadies ? 'bg-[#e91e63]' : 'bg-slate-200 cursor-not-allowed') : isSelected ? 'bg-blue-100 border-[#3366cc]' : 'bg-white hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                if (layout === "sleeper") {
                                  return (
                                    <>
                                      <div className="relative border border-slate-200 rounded-xl p-4 pl-10 h-32 flex items-center">
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold tracking-widest text-slate-400">UPPER</div>
                                        <div className="flex flex-col gap-5 w-full">
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 6}).map((_, i) => {
                                                const seat = `U${i+1}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-2 rounded transition border-2 ${isBooked ? 'bg-slate-200 border-slate-200 cursor-not-allowed' : isSelected ? 'bg-[#3366cc] border-[#3366cc]' : 'bg-white border-slate-300 hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 6}).map((_, i) => {
                                                const seat = `U${i+7}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-2 rounded transition border-2 ${isBooked ? 'bg-slate-200 border-slate-200 cursor-not-allowed' : isSelected ? 'bg-[#3366cc] border-[#3366cc]' : 'bg-white border-slate-300 hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative border border-slate-200 rounded-xl p-4 pl-10 h-32 flex items-center mt-4">
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold tracking-widest text-slate-400">LOWER</div>
                                        <div className="flex items-center mr-6">
                                            <div className="h-6 w-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                                <div className="w-3 h-1 bg-slate-300 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-5 w-full">
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 6}).map((_, i) => {
                                                const seat = `L${i+1}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-2 rounded transition border-2 ${isBooked ? 'bg-slate-200 border-slate-200 cursor-not-allowed' : isSelected ? 'bg-[#3366cc] border-[#3366cc]' : 'bg-white border-slate-300 hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                          <div className="flex justify-between w-full">
                                            {Array.from({length: 6}).map((_, i) => {
                                                const seat = `L${i+7}`;
                                                const isBooked = bookedSeats.includes(seat);
                                                const isSelected = selectedSeats.includes(seat);
                                                return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 flex-1 mx-2 rounded transition border-2 ${isBooked ? 'bg-slate-200 border-slate-200 cursor-not-allowed' : isSelected ? 'bg-[#3366cc] border-[#3366cc]' : 'bg-white border-slate-300 hover:border-[#3366cc]'}`}></button>;
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                }

                                // Layout mixed
                                return (
                                  <>
                                    {/* UPPER SLEEPER */}
                                    <div className="relative border border-slate-200 rounded-xl p-4 pl-10 h-28 flex items-center">
                                      <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold tracking-widest text-slate-400">UPPER</div>
                                      <div className="flex flex-col gap-4 w-full">
                                        <div className="flex justify-between w-full">
                                          {Array.from({length: 5}).map((_, i) => {
                                           const seat = `U${i+1}`;
                                              const isBooked = bookedSeats.includes(seat);
                                              const isSelected = selectedSeats.includes(seat);
                                              return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 w-[14%] rounded transition border-2 ${isBooked ? 'bg-slate-200 border-slate-200 cursor-not-allowed' : isSelected ? 'bg-[#3366cc] border-[#3366cc]' : 'bg-white border-slate-300 hover:border-[#3366cc]'}`}></button>;
                                          })}
                                        </div>
                                        <div className="flex justify-between w-full">
                                          {Array.from({length: 5}).map((_, i) => {
                                              const seat = `U${i+6}`;
                                              const isBooked = bookedSeats.includes(seat);
                                              const isSelected = selectedSeats.includes(seat);
                                              return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-8 w-[14%] rounded transition border-2 ${isBooked ? 'bg-slate-200 border-slate-200 cursor-not-allowed' : isSelected ? 'bg-[#3366cc] border-[#3366cc]' : 'bg-white border-slate-300 hover:border-[#3366cc]'}`}></button>;
                                          })}
                                        </div>
                                      </div>
                                    </div>

                                    {/* LOWER SEATER */}
                                    <div className="relative border border-slate-200 rounded-xl p-6 pl-10 flex items-center gap-6 mt-4">
                                      <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold tracking-widest text-slate-400">LOWER</div>
                                      
                                      <div className="flex items-center">
                                          <div className="h-6 w-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                              <div className="w-3 h-1 bg-slate-400 rounded-full"></div>
                                          </div>
                                      </div>

                                      <div className="flex flex-col gap-6 w-full">
                                        {/* Lower Row 1 (Seater) */}
                                        <div className="flex justify-between w-full">
                                          {Array.from({length: 8}).map((_, i) => {
                                           const seat = `L${i+1}`;
                                              const isBooked = bookedSeats.includes(seat);
                                              const isSelected = selectedSeats.includes(seat);
                                              const isLadies = false;
                                              return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-6 flex-1 mx-1 rounded transition border-t-[8px] border-b-[4px] border-l-[4px] border-r-0 border-slate-300 rounded-l-md ${isBooked ? (isLadies ? 'bg-[#e91e63]' : 'bg-slate-200 cursor-not-allowed') : isSelected ? 'bg-blue-100 border-[#3366cc]' : 'bg-white hover:border-[#3366cc]'}`}></button>;
                                          })}
                                        </div>
                                        {/* Lower Row 2 (Seater) */}
                                        <div className="flex justify-between w-full">
                                          {Array.from({length: 8}).map((_, i) => {
                                           const seat = `L${i+9}`;
                                              const isBooked = bookedSeats.includes(seat);
                                              const isSelected = selectedSeats.includes(seat);
                                              const isLadies = false;
                                              return <button key={seat} onClick={() => !isBooked && handleSeatClick(seat)} className={`h-6 flex-1 mx-1 rounded transition border-t-[8px] border-b-[4px] border-l-[4px] border-r-0 border-slate-300 rounded-l-md ${isBooked ? (isLadies ? 'bg-[#e91e63]' : 'bg-slate-200 cursor-not-allowed') : isSelected ? 'bg-blue-100 border-[#3366cc]' : 'bg-white hover:border-[#3366cc]'}`}></button>;
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                             })()}
                          </div>

                          {selectedSeats.length > 0 && (
                            <div className="mt-6 flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-6 gap-4">
                              <div className="text-center md:text-left">
                                  <p className="font-semibold text-slate-500 mb-1">Route: {trip?.from || "Aristo"} → {trip?.to || "Malap"}</p>
                                  <h3 className="text-2xl font-bold text-slate-900">Total: ₹ {totalAmount}</h3>
                              </div>
                              <button 
                                onClick={() => navigate("/checkout", { state: { trip, selectedSeats, totalAmount, boardingPointId: boardingPoint, droppingPointId: droppingPoint } })}
                                className="bg-[#ff7043] hover:bg-[#eb6136] text-white font-bold px-10 py-3 rounded-lg shadow transition w-full md:w-auto"
                              >
                                CONTINUE
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      <div className="grid md:grid-cols-[250px_1fr_1fr] gap-8 bg-white p-8 rounded-xl border border-slate-200">
                        {(() => {
                          const avgRating = reviewsData.length > 0 ? (reviewsData.reduce((acc, curr) => acc + curr.rating, 0) / reviewsData.length).toFixed(1) : "0.0";
                          const totalRates = reviewsData.length;
                          const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                          reviewsData.forEach(r => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
                          const getPct = (val) => totalRates > 0 ? Math.round((val / totalRates) * 100) : 0;
                          
                          return (
                            <>
                              <div className="border-r border-slate-100 pr-6">
                                  <div className="mb-6">
                                    <p className="text-4xl font-bold text-slate-900 inline-flex items-end gap-2">
                                      <span className="text-[#01b559]">{avgRating}</span> 
                                      <span className="text-sm font-normal text-slate-500 pb-1">from {totalRates} Ratings</span>
                                    </p>
                                  </div>
                                  <div className="space-y-3 text-sm font-medium text-slate-500">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                      <div key={star} className="flex items-center gap-3">
                                        <span>{star}</span>
                                        <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-[#3366cc]" style={{ width: `${getPct(counts[star])}%` }}></div>
                                        </div>
                                        <span className="w-8 text-right">{getPct(counts[star])}%</span>
                                      </div>
                                    ))}
                                  </div>
                              </div>
                              <div className="px-2">
                                  <p className="font-semibold text-slate-900 mb-4">People Liked</p>
                                  <div className="flex flex-wrap gap-2">
                                    {reviewsData.length > 0 ? (
                                      <span className="bg-[#ccf0dc] text-[#008f4c] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">Proper work <span className="bg-[#008f4c] text-white rounded-full h-5 w-5 flex items-center justify-center">✓</span></span>
                                    ) : (
                                       <div className="h-full flex items-center text-slate-400 text-sm italic">Nothing reported yet.</div>
                                    )}
                                  </div>
                              </div>
                              <div>
                                  <p className="font-semibold text-slate-900 mb-4">Could Be Better</p>
                                  <div className="h-full flex items-center text-slate-400 text-sm italic">Nothing reported yet.</div>
                              </div>
                              
                              <div className="col-span-full md:col-span-3 border-t border-slate-100 pt-8 mt-2 grid md:grid-cols-2 gap-8">
                                  {reviewsLoading ? (
                                     <p className="text-slate-500">Loading reviews...</p>
                                  ) : reviewsData.length > 0 ? (
                                      reviewsData.map(rev => (
                                          <div key={rev._id} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex gap-3 items-center">
                                                    {rev.user?.profileImage ? (
                                                      <img src={rev.user.profileImage} alt={rev.user.firstName} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center"><User size={20} /></div>
                                                    )}
                                                    <span className="font-semibold text-slate-800">{rev.user?.firstName} {rev.user?.lastName}</span>
                                                </div>
                                                <div className="flex gap-3 items-center"><span className="bg-[#01b559] text-white px-1.5 py-0.5 text-xs font-bold rounded">{rev.rating}.0/5</span> <span className="text-xs font-medium text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span></div>
                                            </div>
                                            {rev.title && <h4 className="font-bold text-slate-800 mb-1">{rev.title}</h4>}
                                            <p className="text-slate-700">{rev.review}</p>
                                          </div>
                                      ))
                                  ) : (
                                      <p className="text-slate-500 col-span-full text-center py-4">No reviews have been written for this bus yet.</p>
                                  )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {activeTab === "policies" && (
                      <div className="bg-white p-8 rounded-xl border border-slate-200">
                          <div className="bg-[#ebf5ec] text-[#008f4c] font-medium p-4 text-sm mb-6 rounded border border-[#ccf0dc]">
                            *Partial cancellation is allowed.
                          </div>
                          <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    <th className="p-4 font-bold text-slate-800 w-2/3 border-r border-slate-200">Time Slab</th>
                                    <th className="p-4 font-bold text-slate-800">Cancellation Charges</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr className="border-b border-slate-100">
                                    <td className="p-4 border-r border-slate-200 text-slate-700">Until 17th Apr 07:30 PM</td>
                                    <td className="p-4 font-medium text-slate-900">Rs. 135</td>
                                  </tr>
                                  <tr className="border-b border-slate-100">
                                    <td className="p-4 border-r border-slate-200 text-slate-700">Between 17th Apr 07:30 PM - 18th Apr 09:30 AM</td>
                                    <td className="p-4 font-medium text-slate-900">Rs. 225</td>
                                  </tr>
                                  <tr className="border-b border-slate-100">
                                    <td className="p-4 border-r border-slate-200 text-slate-700">Between 18th Apr 09:30 AM - 18th Apr 03:30 PM</td>
                                    <td className="p-4 font-medium text-slate-900">Rs. 450</td>
                                  </tr>
                                  <tr className="border-b border-slate-200">
                                    <td className="p-4 border-r border-slate-200 text-slate-700">After 18th Apr 03:30 PM</td>
                                    <td className="p-4 font-medium text-slate-900">Rs. 810</td>
                                  </tr>
                                  <tr>
                                    <td colSpan="2" className="p-4 text-red-500 font-medium text-xs bg-red-50/30">
                                        "Note : Cancellation policy mentioned on website OR on ticket is of bus operator and is not decided by GoPath. GoPath does not levy any cancellation charges."
                                    </td>
                                  </tr>
                              </tbody>
                            </table>
                          </div>
                      </div>
                    )}

                    {activeTab === "boarding" && (
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Boarding Points</h3>
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                {boardingPointsList.map((pt, idx) => (
                                  <div key={pt._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"><CheckCircle2 size={16} /></div>
                                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 border border-slate-100 p-4 rounded-xl">
                                          <p className="font-bold text-blue-600 mb-1">{pt.time}</p>
                                          <p className="font-bold text-slate-800">{pt.name}</p>
                                          <p className="text-sm text-slate-500 mt-1">{pt.landmark} • {pt.city}</p>
                                      </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          
                          <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Dropping Points</h3>
                            <div className="space-y-4">
                                {droppingPointsList.map(pt => (
                                  <div key={pt._id} className="border border-slate-100 p-5 bg-slate-50 rounded-xl relative overflow-hidden">
                                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
                                      <p className="font-bold text-blue-600 mb-1">{pt.time}</p>
                                      <p className="font-bold text-slate-800">{pt.name}</p>
                                      <p className="text-sm text-slate-500 mt-1">{pt.landmark} • {pt.city}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                      </div>
                    )}

                    {activeTab === "amenities" && (
                      <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-wrap gap-4">
                          <span className="border border-slate-200 text-slate-700 bg-slate-50 rounded-lg px-5 py-3 font-semibold shadow-sm flex items-center gap-2"><Wifi size={18} className="text-blue-500" /> Wifi</span>
                          <span className="border border-slate-200 text-slate-700 bg-slate-50 rounded-lg px-5 py-3 font-semibold shadow-sm flex items-center gap-2"><Droplet size={18} className="text-blue-500" /> Water Bottle</span>
                          <span className="border border-slate-200 text-slate-700 bg-slate-50 rounded-lg px-5 py-3 font-semibold shadow-sm flex items-center gap-2"><Bed size={18} className="text-blue-500" /> Blanket</span>
                          <span className="border border-slate-200 text-slate-700 bg-slate-50 rounded-lg px-5 py-3 font-semibold shadow-sm flex items-center gap-2"><PlugZap size={18} className="text-blue-500" /> Charging Point</span>
                          <span className="border border-slate-200 text-slate-700 bg-slate-50 rounded-lg px-5 py-3 font-semibold shadow-sm flex items-center gap-2"><Film size={18} className="text-blue-500" /> Movie</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
           </div>
           
        </div>
      </div>
    </MainLayout>
  );
}