'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, Save, ArrowLeft, LogOut, Camera, Lock, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 relative font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Advanced Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-100/40 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
      </div>

      {/* Header - Floating Glass Panel */}
      <header className="bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors group">
                  <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-slate-900 transition" />
                </button>
              </Link>
              <h1 className="font-extrabold text-slate-900 text-xl tracking-tight">Account Settings</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white border border-red-100 hover:border-red-600 transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-100/50 to-teal-50/50" />
              <div className="relative z-10 pt-4">
                <div className="relative inline-block mb-6">
                  <div className="w-28 h-28 bg-white rounded-[1.5rem] flex items-center justify-center text-4xl font-extrabold text-slate-700 shadow-lg border border-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-teal-600 text-white rounded-xl shadow-md hover:bg-teal-700 hover:scale-105 transition-all active:scale-95 border-2 border-white">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user?.name}</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Patient Account</p>
                <div className="mt-8 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100 shadow-sm mx-auto w-max">
                  <Shield className="h-3 w-3" />
                  <span>Verified Profile</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-4 space-y-2">
                {[
                  { icon: User, label: 'Personal Info', active: true },
                  { icon: Lock, label: 'Security', active: false },
                  { icon: Bell, label: 'Notifications', active: false },
                  { icon: Shield, label: 'Privacy', active: false },
                ].map((item, i) => (
                  <button
                    key={i}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      item.active ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${item.active ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personal Information</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Update your basic account details</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl text-slate-700 active:scale-95 font-bold text-xs uppercase tracking-widest transition-all bg-white shadow-sm self-start sm:self-auto"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Info'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      defaultValue={user?.name}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-900 font-bold shadow-sm disabled:opacity-70 disabled:bg-slate-50 disabled:shadow-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      disabled={!isEditing}
                      defaultValue={user?.email}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-900 font-bold shadow-sm disabled:opacity-70 disabled:bg-slate-50 disabled:shadow-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-900 font-bold shadow-sm disabled:opacity-70 disabled:bg-slate-50 disabled:shadow-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-900 font-bold shadow-sm disabled:opacity-70 disabled:bg-slate-50 disabled:shadow-none"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10"
                >
                  <button className="w-full btn-premium py-5 font-extrabold text-sm tracking-widest uppercase rounded-2xl shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-3 transition-transform active:scale-[0.98]">
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                </motion.div>
              )}
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl" />
              <div className="flex items-start space-x-6 relative z-10">
                <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center shadow-sm border border-white flex-shrink-0 text-emerald-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="pt-1">
                  <h4 className="font-extrabold text-emerald-950 tracking-tight text-lg mb-1">Data Security & Privacy</h4>
                  <p className="text-sm text-emerald-800/80 font-medium leading-relaxed max-w-md">
                    Your medical data is encrypted using AES-256 standards. Only you and authorized specialists can access your history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
