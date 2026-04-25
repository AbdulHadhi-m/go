import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { 
  User, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Camera, 
  Mail, 
  Phone, 
  Calendar, 
  Globe, 
  Flag, 
  CreditCard,
  Lock,
  ChevronRight,
  Wallet,
  Settings,
  Bell,
  Gift
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import {
  changePassword,
  clearUserState,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
} from "../features/user/userSlice";
import { setAuthUser, logoutUser } from "../features/auth/authSlice";
import { getRewardBalance, getRewardHistory } from "../features/reward/rewardSlice";
import { useNavigate } from "react-router-dom";
import BusCoinImg from "../assets/buscoin.svg";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading: profileLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );
  const { balance, history, isLoading: rewardLoading } = useSelector(
    (state) => state.reward
  );

  const isLoading = profileLoading || rewardLoading;

  const [activeTab, setActiveTab] = useState("my-profile");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
    gender: "Male",
    dob: "",
    nationality: "Indian",
    maritalStatus: "Single"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getRewardBalance());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "rewards") {
      dispatch(getRewardHistory());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar: profile.avatar || "",
        gender: profile.gender || "Male",
        dob: profile.dob || "",
        nationality: profile.nationality || "Indian",
        maritalStatus: profile.maritalStatus || "Single"
      });

      if (user && (user.firstName !== profile.firstName || user.lastName !== profile.lastName || user.avatar !== profile.avatar)) {
        dispatch(setAuthUser({ ...user, ...profile, token: user?.token }));
      }
    }
  }, [profile, dispatch, user]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(clearUserState());
    }
    if (isSuccess && message) {
      toast.success(message);
      dispatch(clearUserState());
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(updateMyProfile(formData));
    if (updateMyProfile.fulfilled.match(response) && response.payload?.user) {
      dispatch(setAuthUser({ ...user, ...response.payload.user, token: user?.token }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const res = await dispatch(changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }));
    if (changePassword.fulfilled.match(res)) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const payload = new FormData();
    payload.append("avatar", file);

    dispatch(uploadAvatar(payload)).then((res) => {
      if (uploadAvatar.fulfilled.match(res) && res.payload?.user) {
        dispatch(setAuthUser({ ...user, ...res.payload.user, token: user?.token }));
      }
    }).finally(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const calculateCompletion = () => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'avatar', 'dob'];
    const filled = fields.filter(f => formData[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const tabs = [
    { id: "my-profile", label: "My Profile", icon: <User size={20} /> },
    { id: "rewards", label: "GoCoins Wallet", icon: <img src={BusCoinImg} alt="coin" className="w-5 h-5 object-contain" /> },
    { id: "security", label: "Login & Security", icon: <Lock size={20} /> },
    { id: "co-travellers", label: "Co-travellers", icon: <Users size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { id: "safety", label: "Safety & Privacy", icon: <ShieldCheck size={20} /> },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pb-20">
        
        {/* Premium Hero Banner */}
        <div className="relative h-80 w-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 overflow-hidden">
           <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900/30 rounded-full blur-3xl"></div>
           </div>

           <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-16 gap-x-8 relative z-40">
              <div className="relative group shrink-0">
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                     <img 
                      src={(formData.avatar && formData.avatar !== "undefined" && formData.avatar !== "null") ? formData.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName || 'User')}+${encodeURIComponent(formData.lastName || '')}&background=ef4444&color=fff&size=128`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName || 'User')}+${encodeURIComponent(formData.lastName || '')}&background=ef4444&color=fff&size=128`;
                      }}
                    />
                 </div>
                 <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 p-2.5 bg-white rounded-full shadow-lg text-red-600 hover:scale-110 transition active:scale-95 border border-red-50 disabled:opacity-50" disabled={isLoading}>
                    <Camera size={20} />
                 </button>
                 <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
              </div>

              <div className="flex-1">
                 <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">{formData.firstName} {formData.lastName}</h1>
                 <div className="flex flex-wrap items-center gap-6 mt-4 text-white/95">
                    <div className="flex items-center gap-2 text-sm font-bold">
                       <Phone size={16} className="opacity-80" /> {formData.phone || "No phone added"}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold">
                       <Mail size={16} className="opacity-80" /> {formData.email}
                    </div>
                    <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-white/40">
                       GoTribe Elite MEMBER
                    </div>
                 </div>
              </div>

              <div className="hidden xl:flex gap-4 mb-4">
                 <div className="bg-white/10 backdrop-blur-lg px-8 py-5 rounded-[2rem] border border-white/20 flex flex-col items-center shadow-lg">
                    <img src={BusCoinImg} alt="BusCoin" className="w-8 h-8 mb-1 drop-shadow-[0_0_12px_rgba(255,215,0,0.4)] object-contain" />
                    <p className="text-2xl font-black text-white">{profile?.rewardCoins || 0}</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-lg px-8 py-5 rounded-[2rem] border border-white/20 flex flex-col items-center shadow-lg">
                    <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Trip Count</p>
                    <p className="text-2xl font-black text-white">{profile?.tripCount || 0}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-30 pb-20">
           <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Sidebar Tabs */}
              <aside className="w-full lg:w-80 space-y-4 shrink-0">
                 <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200/60 p-5 pt-8">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-6">Account Settings</p>
                    <nav className="space-y-1.5">
                       {tabs.map(tab => (
                         <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300
                            ${activeTab === tab.id 
                               ? 'bg-red-50 text-red-600 shadow-inner' 
                               : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                         >
                           <div className="flex items-center gap-4">
                              <span className={activeTab === tab.id ? 'text-red-600' : 'text-slate-400'}>{tab.icon}</span>
                              {tab.label}
                           </div>
                           <ChevronRight size={16} className={`opacity-40 transition-transform ${activeTab === tab.id ? 'translate-x-1' : ''}`} />
                         </button>
                       ))}
                    </nav>
                 </div>

                 <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-9 py-5 bg-white border border-slate-200/60 rounded-[2rem] text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors shadow-sm"
                 >
                    <LogOut size={20} /> Log Out
                 </button>
              </aside>

              {/* Dynamic View Area */}
              <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 p-8 md:p-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 
                 {activeTab === 'my-profile' && (
                   <div className="space-y-12">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
                         <div>
                            <h2 className="text-2xl font-black text-slate-900 capitalize">Personal Information</h2>
                            <p className="text-sm text-slate-400 font-semibold mt-1">Manage your basic contact and identity details.</p>
                         </div>
                         <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="relative w-12 h-12">
                               <svg className="w-12 h-12 transform -rotate-90">
                                  <circle cx="24" cy="24" r="20" className="stroke-slate-200" strokeWidth="4" fill="none" />
                                  <circle cx="24" cy="24" r="20" className="stroke-red-500" strokeWidth="4" fill="none" strokeDasharray="125" strokeDashoffset={125 - (125 * calculateCompletion() / 100)} strokeLinecap="round" />
                               </svg>
                               <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">{calculateCompletion()}%</span>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Profile Score</p>
                               <p className="text-xs font-bold text-red-600 mt-1">Complete your info</p>
                            </div>
                         </div>
                      </div>

                      <form onSubmit={handleProfileSubmit} className="space-y-10">
                         {/* General Info */}
                         <section>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-l-4 border-red-500 pl-4 bg-slate-50 py-2 rounded-r-lg">General Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                  <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                  <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all">
                                     <option>Male</option>
                                     <option>Female</option>
                                     <option>Non-binary</option>
                                  </select>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                  <div className="relative">
                                     <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all" />
                                  </div>
                               </div>
                            </div>
                         </section>

                         {/* Contact Info */}
                         <section>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-l-4 border-amber-500 pl-4 bg-slate-50 py-2 rounded-r-lg">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2 lg:col-span-1">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                  <div className="relative">
                                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                     <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all" />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                  <div className="relative">
                                     <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                     <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all" />
                                  </div>
                               </div>
                            </div>
                         </section>


                         <div className="flex pt-6">
                            <button 
                              type="submit" 
                              disabled={isLoading}
                              className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-2xl shadow-slate-300 hover:bg-slate-800 transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                            >
                               {isLoading ? "Synchronizing Data..." : "Save My Profile"}
                            </button>
                         </div>
                      </form>
                   </div>
                 )}

                  {activeTab === 'rewards' && (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="border-b border-slate-100 pb-8 flex justify-between items-center">
                          <div>
                             <h2 className="text-2xl font-black text-slate-900 capitalize">GoCoins Wallet</h2>
                             <p className="text-sm text-slate-400 font-semibold mt-1">Earned through your travels with GoPath.</p>
                          </div>
                          <div className="bg-red-50 px-6 py-4 rounded-3xl border border-red-100 flex items-center gap-4">
                             <img src={BusCoinImg} alt="BusCoin" className="w-14 h-14 drop-shadow-md object-contain" />
                             <div className="text-left">
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Total Balance</p>
                                <p className="text-3xl font-black text-red-600 leading-none">{profile?.rewardCoins || 0}</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden">
                          <div className="relative z-10">
                             <h3 className="text-lg font-bold">Rewards Program</h3>
                             <p className="text-slate-400 text-sm mt-2 max-w-md">You earn 3% of your booking amount as GoCoins after every completed trip. 1 GoCoin = ₹0.50 discount on future bookings.</p>
                             <div className="mt-6 inline-block px-4 py-2 bg-white/10 rounded-xl text-xs font-bold border border-white/10">
                                Use coins on your next booking
                             </div>
                          </div>
                          <Gift size={120} className="absolute -right-8 -bottom-8 text-white/5 -rotate-12" />
                       </div>

                       <div className="space-y-4">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest ml-1">Transaction History</h3>
                          
                          {history && history.length > 0 ? (
                            <div className="space-y-3">
                               {history.map((tx) => (
                                 <div key={tx._id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                           tx.type === 'EARN' ? 'bg-green-50' : 
                                           tx.type === 'REDEEM' ? 'bg-rose-50' : 'bg-slate-100'
                                        }`}>
                                           <img src={BusCoinImg} alt="coin" className={`w-7 h-7 object-contain ${tx.type === 'REDEEM' ? 'grayscale opacity-70' : ''}`} />
                                        </div>
                                       <div>
                                          <p className="font-bold text-slate-900">{tx.description}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                             {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                             {tx.booking && ` • Trip ID: ${tx.booking._id.slice(-6).toUpperCase()}`}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className={`text-lg font-black ${
                                          tx.type === 'EARN' ? 'text-green-600' : 'text-red-600'
                                       }`}>
                                          {tx.type === 'EARN' ? '+' : '-'}{tx.coins}
                                       </p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase">Coins</p>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          ) : (
                            <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                               <p className="text-slate-400 font-bold">No reward transactions yet.</p>
                               <p className="text-xs text-slate-300 mt-1">Complete a trip to earn your first GoCoins!</p>
                            </div>
                          )}
                       </div>
                    </div>
                  )}

                 {activeTab === 'security' && (
                   <div className="space-y-12 animate-in fade-in">
                      <div className="border-b border-slate-100 pb-8">
                         <h2 className="text-2xl font-black text-slate-900 capitalize">Login & Security</h2>
                         <p className="text-sm text-slate-400 font-semibold mt-1">Keep your credentials updated to ensure account safety.</p>
                      </div>

                      <form onSubmit={handlePasswordSubmit} className="max-w-xl space-y-6">
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all" placeholder="••••••••" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Secure Password</label>
                            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all" placeholder="Enter new password" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all" placeholder="Re-type password" />
                         </div>
                         <button 
                           type="submit" 
                           disabled={isLoading}
                           className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-sm shadow-2xl shadow-red-100 hover:bg-red-700 transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                         >
                            {isLoading ? "Securing Account..." : "Update Private Password"}
                         </button>
                      </form>
                   </div>
                 )}

                 {activeTab === 'co-travellers' && (
                    <div className="p-12 text-center space-y-4">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <Users size={40} />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-slate-900">No Co-travellers Yet</h3>
                          <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">Add friends and family to book tickets instantly without entering details repeatedly.</p>
                          <button className="mt-6 px-8 py-3 bg-white border-2 border-slate-200 rounded-2xl text-xs font-black hover:border-red-500 transition group flex items-center gap-2 mx-auto">
                             <PlusCircle size={14} className="group-hover:text-red-500" /> ADD NEW TRAVELLER
                          </button>
                       </div>
                    </div>
                 )}

              </main>

           </div>
        </div>

      </div>
    </MainLayout>
  );
}

// Helper icon
const PlusCircle = ({ size, className }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

const MinusCircle = ({ size, className }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

