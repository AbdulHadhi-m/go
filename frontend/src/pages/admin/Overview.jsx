import React from "react";
import {
  Users as UsersIcon,
  Ticket,
  TrendingUp,
  CircleDollarSign,
  LayoutDashboard,
  AlertCircle
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register Chart.js plugins
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition flex items-center gap-4 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-bold text-slate-400 tracking-wider uppercase">{title}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default function Overview({
  stats,
  dailyBookings,
  bookings,
  complaints,
  operators,
  setActiveTab
}) {
  const chartDataFeed = dailyBookings?.length > 0 ? dailyBookings : [
    { date: "Day 1", count: 3, revenue: 3600 },
    { date: "Day 2", count: 5, revenue: 6000 },
    { date: "Day 3", count: 2, revenue: 2400 },
    { date: "Day 4", count: 8, revenue: 9600 },
    { date: "Day 5", count: 6, revenue: 7200 },
    { date: "Day 6", count: 9, revenue: 10800 },
    { date: "Day 7", count: 4, revenue: 4800 },
  ];

  const lineChartData = {
    labels: chartDataFeed.map((b) => b.date),
    datasets: [
      {
        label: "Daily Bookings",
        data: chartDataFeed.map((b) => b.count),
        fill: true,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Revenue (₹)",
        data: chartDataFeed.map((b) => typeof b.revenue === 'number' ? b.revenue : b.count * 1200),
        fill: true,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        yAxisID: "y1",
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6, font: { family: 'inter', weight: 'bold' } } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleFont: { size: 14 }, padding: 12, cornerRadius: 8 }
    },
    scales: {
      x: { grid: { display: false } },
      y: { type: 'linear', display: true, position: 'left', grid: { borderDash: [4, 4] } },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } },
    }
  };

  const doughnutData = {
    labels: ["Users", "Operators", "Buses"],
    datasets: [{
      data: [stats?.totalUsers || 10, stats?.totalOperators || 3, stats?.totalBuses || 8],
      backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
      hoverOffset: 8,
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<UsersIcon size={24} />} color="text-blue-600" bg="bg-blue-100" />
        <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue || 0}`} icon={<CircleDollarSign size={24} />} color="text-emerald-600" bg="bg-emerald-100" />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon={<Ticket size={24} />} color="text-purple-600" bg="bg-purple-100" />
        <StatCard title="Active Routes" value={stats?.activeRoutes || 0} icon={<TrendingUp size={24} />} color="text-amber-600" bg="bg-amber-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 xl:p-8">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2"><TrendingUp className="text-red-500" /> Real-time Analytics</h3>
           </div>
           <div className="h-80 w-full relative">
             <Line data={lineChartData} options={lineChartOptions} />
           </div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 xl:p-8 flex flex-col justify-between relative">
           <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2"><LayoutDashboard className="text-blue-500" size={20} /> System Distribution</h3>
           <div className="h-48 mt-4 w-full flex justify-center pb-4">
             <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } } }} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 xl:p-8">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6">Recent Bookings</h3>
            <div className="space-y-4">
               {bookings.slice(0, 5).map(b => (
                 <div key={b._id} className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {b.user?.firstName?.charAt(0) || 'G'}
                       </div>
                       <div>
                         <p className="font-bold text-sm text-slate-900">{b.user?.firstName} {b.user?.lastName}</p>
                         <p className="text-xs font-semibold text-slate-500">{b.trip?.from} → {b.trip?.to}</p>
                       </div>
                    </div>
                    <span className="font-black text-slate-800 text-base">₹{b.finalAmount || b.totalAmount}</span>
                 </div>
               ))}
               {bookings.length === 0 && <p className="text-center text-sm text-slate-500 py-4">No recent bookings available.</p>}
            </div>
         </div>
         <div className="bg-gradient-to-br from-red-700 to-rose-900 rounded-3xl p-8 xl:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -right-10 -top-10 opacity-10">
               <AlertCircle size={200} />
            </div>
            <h2 className="text-3xl font-black mb-2 relative z-10">Attention Required</h2>
            <p className="text-red-100 mb-8 relative z-10 text-sm">Review pending complaints and operator approvals to keep the platform running smoothly.</p>
            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition cursor-pointer" onClick={() => setActiveTab('complaints')}>
                  <p className="text-xs uppercase tracking-wider font-bold text-red-200">Pending Complaints</p>
                  <p className="text-3xl font-black mt-1">{complaints.filter(c => c.status !== 'resolved').length || 0}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition cursor-pointer" onClick={() => setActiveTab('operators')}>
                  <p className="text-xs uppercase tracking-wider font-bold text-red-200">Pending Operators</p>
                  <p className="text-3xl font-black mt-1">{operators.filter(o => o.operatorApplicationStatus !== 'approved').length || 0}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
