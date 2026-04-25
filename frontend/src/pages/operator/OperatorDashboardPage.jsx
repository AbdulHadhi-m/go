import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Bus,
  CalendarDays,
  Ticket,
  TrendingUp,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import {
  clearOperatorMessage,
  getOperatorDashboardData,
} from "../../features/operator/operatorSlice";

import Overview from "./Overview";
import Fleet from "./Fleet";
import Schedules from "./Schedules";
import Bookings from "./Bookings";
import Reports from "./Reports";

export default function OperatorDashboardPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    buses = [],
    trips = [],
    bookings = [],
    revenueSummary,
    routeAnalytics = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.operator || {});

  useEffect(() => {
    dispatch(getOperatorDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOperatorMessage());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearOperatorMessage());
      dispatch(getOperatorDashboardData()); // Refresh data
    }
  }, [error, successMessage, dispatch]);

  const tabs = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "fleet", label: "Fleet Manager", icon: <Bus size={20} /> },
    { id: "schedules", label: "Trips & Timing", icon: <CalendarDays size={20} /> },
    { id: "bookings", label: "Passenger List", icon: <Ticket size={20} /> },
    { id: "reports", label: "Performance", icon: <TrendingUp size={20} /> },
  ];

  return (
    <MainLayout>
      <div className="h-[calc(100vh-77px)] bg-slate-50/50 flex flex-col md:flex-row border-t border-slate-200/60 overflow-hidden">
        
        {/* Operator Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col">
          <div className="p-8 pb-4">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fleet<span className="text-blue-600">Hub</span></h2>
             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Operator Control Panel</p>
          </div>
          
          <nav className="flex flex-col gap-2 px-4 py-4 overflow-y-auto w-full">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-200 font-bold text-sm w-full outline-none
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
               >
                 <span className={`${activeTab === tab.id ? 'opacity-100' : 'opacity-70'} transition-opacity`}>{tab.icon}</span> 
                 {tab.label}
               </button>
             ))}
          </nav>

          {/* <div className="mt-auto p-6 pt-0">
             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold text-slate-400 mb-1">Operator Profile</p>
                <div className="flex items-center justify-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <span className="text-[10px] uppercase font-black tracking-wider text-blue-600">Verified System</span>
                </div>
             </div>
          </div> */}
        </aside>

        {/* Workspace Canvas Area */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto h-full">
          <div className="max-w-[1400px] mx-auto">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                   <h1 className="text-3xl lg:text-4xl font-black text-slate-900 capitalize tracking-tight">{tabs.find(t=>t.id===activeTab)?.label}</h1>
                   <p className="text-sm font-semibold text-slate-400 mt-2 uppercase tracking-widest font-mono">
                     Managing Enterprise Operations
                   </p>
                </div>
                {loading && (
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm animate-pulse">
                     Syncing Fleet Data...
                  </span>
                )}
             </div>

             <div className="min-h-[500px]">
               {activeTab === 'overview' && <Overview buses={buses} trips={trips} bookings={bookings} revenueSummary={revenueSummary} routeAnalytics={routeAnalytics} />}
               {activeTab === 'fleet' && <Fleet buses={buses} loading={loading} />}
               {activeTab === 'schedules' && <Schedules buses={buses} trips={trips} loading={loading} />}
               {activeTab === 'bookings' && <Bookings bookings={bookings} />}
               {activeTab === 'reports' && <Reports routeAnalytics={routeAnalytics} />}
             </div>
          </div>
        </main>

      </div>
    </MainLayout>
  );
}
