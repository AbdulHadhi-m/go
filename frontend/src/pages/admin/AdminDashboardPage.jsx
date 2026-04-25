import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Briefcase,
  Bus,
  Ticket,
  MessageSquareWarning,
  Tag,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import { clearAdminMessage, fetchAdminDashboard } from "../../features/admin/adminSlice";

import Overview from "./Overview";
import Users from "./Users";
import Operators from "./Operators";
import Buses from "./Buses";
import Bookings from "./Bookings";
import Complaints from "./Complaints";
import CouponManagementPage from "./CouponManagementPage";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    stats,
    dailyBookings = [],
    users = [],
    operators = [],
    buses = [],
    bookings = [],
    complaints = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminMessage());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAdminMessage());
      dispatch(fetchAdminDashboard());
    }
  }, [error, successMessage, dispatch]);

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "users", label: "Manage Users", icon: <UsersIcon size={20} /> },
    { id: "operators", label: "Operators", icon: <Briefcase size={20} /> },
    { id: "buses", label: "Manage Buses", icon: <Bus size={20} /> },
    { id: "bookings", label: "All Bookings", icon: <Ticket size={20} /> },
    { id: "coupons", label: "Coupons", icon: <Tag size={20} /> },
    { id: "complaints", label: "Support Tickets", icon: <MessageSquareWarning size={20} /> },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row mt-1 border-t border-slate-200/60">
        
        {/* Modern Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col">
          <div className="p-8 pb-4">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin<span className="text-red-600">Core</span></h2>
             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Global Master Workspace</p>
          </div>
          
          <nav className="flex flex-col gap-2 px-4 py-4 overflow-y-auto w-full">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-200 font-bold text-sm w-full outline-none
                  ${activeTab === tab.id 
                    ? 'bg-red-50 text-red-700 shadow-sm border border-red-100/50 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
               >
                 <span className={`${activeTab === tab.id ? 'opacity-100' : 'opacity-70'} transition-opacity`}>{tab.icon}</span> 
                 {tab.label}
                 {/* Badge logic for pending tasks */}
                 {tab.id === 'complaints' && complaints.filter(c => c.status !== 'resolved').length > 0 && (
                    <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{complaints.filter(c => c.status !== 'resolved').length}</span>
                 )}
                 {tab.id === 'operators' && operators.filter(o => o.operatorApplicationStatus === 'pending').length > 0 && (
                    <span className="ml-auto bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">{operators.filter(o => o.operatorApplicationStatus === 'pending').length}</span>
                 )}
               </button>
             ))}
          </nav>

          {/* <div className="mt-auto p-6 pt-0 opacity-60 pointer-events-none">
             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold text-slate-400 mb-1">Server Status</p>
                <div className="flex items-center justify-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600">Operational</span>
                </div>
             </div>
          </div> */}
        </aside>

        {/* Dynamic Canvas Area */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto max-h-screen">
          <div className="max-w-[1400px] mx-auto">
             {/* Header */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                   <h1 className="text-3xl lg:text-4xl font-black text-slate-900 capitalize tracking-tight">{tabs.find(t=>t.id===activeTab)?.label}</h1>
                   <p className="text-sm font-semibold text-slate-400 mt-2 uppercase tracking-widest">
                     Administer & Control System Integrations
                   </p>
                </div>
                {loading && (
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm animate-pulse">
                     Syncing Database...
                  </span>
                )}
             </div>

             {/* Swappable Contents */}
             <div className="min-h-[500px]">
               {activeTab === 'overview' && <Overview stats={stats} dailyBookings={dailyBookings} bookings={bookings} complaints={complaints} operators={operators} setActiveTab={setActiveTab} />}
               {activeTab === 'users' && <Users users={users} />}
               {activeTab === 'operators' && <Operators operators={operators} />}
               {activeTab === 'buses' && <Buses buses={buses} />}
               {activeTab === 'bookings' && <Bookings bookings={bookings} />}
               {activeTab === 'coupons' && <CouponManagementPage />}
               {activeTab === 'complaints' && <Complaints complaints={complaints} />}
             </div>
          </div>
        </main>

      </div>
    </MainLayout>
  );
}
