import React from "react";
import {
  Bus,
  CalendarDays,
  Ticket,
  TrendingUp,
  CircleDollarSign
} from "lucide-react";
import { Line } from "react-chartjs-2";
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

export default function Overview({ buses = [], trips = [], bookings = [], revenueSummary, routeAnalytics = [] }) {
  const analyticsData = routeAnalytics?.length > 0 ? routeAnalytics : [
    { route: "Calicut → Bangalore", averageOccupancy: 85 },
    { route: "Kochi → Chennai", averageOccupancy: 72 },
    { route: "Mysore → Hyderabad", averageOccupancy: 64 },
    { route: "Coimbatore → Goa", averageOccupancy: 91 },
    { route: "Thrissur → Mumbai", averageOccupancy: 45 },
  ];

  const revenueChartData = {
    labels: analyticsData.map(r => r.route.split('→')[0].trim()),
    datasets: [{
      label: 'Occupancy %',
      data: analyticsData.map(r => r.averageOccupancy),
      fill: true,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        return gradient;
      },
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgb(59, 130, 246)',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          title: (items) => `Route: ${analyticsData[items[0].dataIndex].route}`,
          label: (context) => ` Avg. Occupancy: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' }
      },
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: { borderDash: [5, 5], color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Fleet" value={buses.length} icon={<Bus size={24} />} color="text-blue-600" bg="bg-blue-100" />
        <StatCard title="Total Trips" value={trips.length} icon={<CalendarDays size={24} />} color="text-purple-600" bg="bg-purple-100" />
        <StatCard title="Confirmed Bookings" value={bookings.length} icon={<Ticket size={24} />} color="text-amber-600" bg="bg-amber-100" />
        <StatCard title="Net Earnings" value={`₹${revenueSummary?.netRevenue || 0}`} icon={<CircleDollarSign size={24} />} color="text-emerald-600" bg="bg-emerald-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 xl:p-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <TrendingUp size={120} className="text-blue-600" />
           </div>
           <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={22} /> Occupancy Analytics
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Efficiency per active route</p>
              </div>
           </div>
           <div className="h-[340px] w-full relative z-10">
             <Line data={revenueChartData} options={chartOptions} />
           </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg flex flex-col justify-center">
           <h2 className="text-2xl font-black mb-2">Fleet Status</h2>
           <p className="text-blue-100 mb-6 text-sm">Operation summary of your active buses.</p>
           <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                 <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Trips Today</p>
                 <p className="text-2xl font-black">
                   {trips.filter(t => {
                     if (!t.journeyDate) return false;
                     const tripDate = new Date(t.journeyDate);
                     const today = new Date();
                     return tripDate.getDate() === today.getDate() &&
                            tripDate.getMonth() === today.getMonth() &&
                            tripDate.getFullYear() === today.getFullYear();
                   }).length}
                 </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                 <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Pending Bookings</p>
                 <p className="text-2xl font-black">{bookings.filter(b => b.paymentStatus === 'pending' || b.bookingStatus === 'pending').length}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-extrabold text-slate-800 mb-6">Recent Activity</h3>
        <div className="space-y-4 text-sm">
           {trips.slice(0, 5).map(t => (
             <div key={t._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><CalendarDays size={18}/></div>
                   <div>
                      <p className="font-bold text-slate-900">{t.from} to {t.to}</p>
                      <p className="text-xs text-slate-400 font-semibold">{new Date(t.journeyDate).toLocaleDateString()}</p>
                   </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${t.tripStatus === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                   {t.tripStatus || 'SCHEDULED'}
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
