'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Upload, Activity, Shield, Clock, CheckCircle, ArrowRight, Heart, Zap, MessageCircle, TrendingUp, Users, FileText, LogOut, User as UserIcon, History, Bell, AlertTriangle, Phone, Calendar, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [healthScore, setHealthScore] = useState(85);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData || '{}'));
    loadDashboardData(token);
  }, []);

  const loadDashboardData = async (token: string) => {
    try {
      const [consultationsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/api/consultations?limit=3`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/symptoms/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setRecentConsultations(consultationsRes.data);
      if (analyticsRes.data.health_score) {
        setHealthScore(analyticsRes.data.health_score);
      }
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      setRecentConsultations([]);
      setHealthScore(85);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 relative font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Advanced Ambient Light Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
      </div>

      {/* Header - Floating Glass Panel */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm transition-transform">
                   <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl text-title text-slate-900"><span className="font-bold">Obvis</span> <span className="text-slate-500 font-medium">AI</span></span>
              </Link>
              <div className="h-6 w-px bg-slate-200 hidden md:block" />
              <div className="hidden md:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Center</p>
                <p className="text-sm font-semibold text-slate-700">{user?.name || 'Guest User'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors relative">
                <Bell className="h-4 w-4 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50" />
              </button>
              
              <div className="w-px h-6 bg-slate-200" />

              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm group-hover:bg-slate-200 transition-colors">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span>System Online</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">Diagnostic <span className="text-teal-600">Center</span></h2>
            <p className="text-slate-500 font-medium text-lg">Your intelligent medical interface</p>
          </motion.div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Actions GRID */}
          {[
            { icon: MessageCircle, title: 'Consult AI', desc: 'Secure Diagnostic Session', href: '/consult', color: 'text-teal-600', bg: 'bg-teal-50', hover: 'group-hover:bg-teal-600 group-hover:text-white', border: 'hover:border-teal-200 hover:shadow-teal-500/10' },
            { icon: Upload, title: 'Upload Data', desc: 'Add Medical Records', href: '/upload-report', color: 'text-blue-600', bg: 'bg-blue-50', hover: 'group-hover:bg-blue-600 group-hover:text-white', border: 'hover:border-blue-200 hover:shadow-blue-500/10' },
            { icon: History, title: 'History', desc: 'Complete Patient Log', href: '/history', color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'group-hover:bg-indigo-600 group-hover:text-white', border: 'hover:border-indigo-200 hover:shadow-indigo-500/10' },
            { icon: UserIcon, title: 'Profile', desc: 'Manage Identity Data', href: '/profile', color: 'text-purple-600', bg: 'bg-purple-50', hover: 'group-hover:bg-purple-600 group-hover:text-white', border: 'hover:border-purple-200 hover:shadow-purple-500/10' }
          ].map((action, i) => (
            <Link href={action.href} key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group h-full"
              >
                <div className={`h-full bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col items-start relative overflow-hidden ${action.border} hover:-translate-y-1`}>
                   <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <div className={`p-4 rounded-2xl ${action.bg} ${action.color} ${action.hover} mb-6 transition-all duration-300 relative z-10 shadow-sm`}>
                      <action.icon className="h-6 w-6" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10 tracking-tight">{action.title}</h3>
                   <p className="text-sm text-slate-500 mb-8 relative z-10 line-clamp-2">{action.desc}</p>
                   <div className="mt-auto flex items-center w-full justify-between relative z-10">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Access</span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors text-slate-400">
                         <ChevronRight className="h-4 w-4" />
                      </div>
                   </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Stats Grid - Floating minimal pods */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, label: 'Sessions', value: recentConsultations.length.toString(), color: 'teal' },
            { icon: Shield, label: 'Trust Rank', value: `${healthScore}%`, color: 'emerald' },
            { icon: Clock, label: 'Latency', value: '42ms', color: 'blue' },
            { icon: CheckCircle, label: 'Security', value: 'Level 1', color: 'indigo' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shadow-sm`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Sections - Bento structure */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Consultations */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="p-8 pb-4 flex justify-between items-center bg-gradient-to-b from-white to-transparent">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Archives</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Your clinical interaction history</p>
              </div>
              <Link href="/history" className="px-4 py-2 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-600 rounded-full transition-colors flex items-center shadow-sm">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            <div className="p-8 pt-4 flex-1">
              {recentConsultations.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mb-6">
                    <FileText className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-bold text-lg mb-2">No active records</p>
                  <p className="text-slate-500 text-sm mb-8 max-w-xs">You haven't had any consultations yet. Start one to build your medical history.</p>
                  <Link href="/consult">
                    <button className="btn-premium px-8">
                      Initialize Consultation <ArrowRight className="ml-2 h-4 w-4 inline" />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentConsultations.map((consultation: any, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center space-x-6 p-5 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-base">{consultation.department}</h4>
                        <div className="flex items-center space-x-2 mt-1 text-xs font-semibold text-slate-500">
                          <span>{new Date(consultation.created_at).toLocaleDateString()}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">Verified</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-slate-900 transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Health Score / Clinical Status */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col items-center border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 blur-2xl" />
            <h3 className="text-xl font-bold text-slate-900 mb-8 self-start tracking-tight">Neural Health</h3>
            
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-white shadow-[inset_0_4px_20px_rgb(0,0,0,0.03)] rounded-full z-0" />
              <svg className="w-48 h-48 transform -rotate-90 relative z-10">
                <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0 502" }}
                  animate={{ strokeDasharray: `${(healthScore / 100) * 502} 502` }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  cx="96"
                  cy="96"
                  r="80"
                  stroke={healthScore >= 80 ? '#0d9488' : '#64748b'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-5xl font-extrabold text-slate-900 leading-none tracking-tight">{healthScore}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Score</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600">Status</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${healthScore >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                   Optimized
                </span>
              </div>
              <Link href="/history">
                <button className="w-full px-6 py-4 bg-white border border-slate-200 hover:border-teal-200 hover:shadow-teal-500/10 hover:shadow-sm text-slate-900 font-bold rounded-2xl transition-all flex items-center justify-center">
                   Deep Diagnostics <ArrowRight className="ml-2 h-4 w-4 text-slate-400" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Emergency Node - High Impact */}
        <div className="group">
          <div className="bg-gradient-to-r from-rose-50 to-orange-50/50 border border-rose-100 p-8 md:p-10 rounded-[2.5rem] overflow-hidden relative shadow-[0_8px_30px_rgb(225,29,72,0.04)] transition-all flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute right-0 top-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl" />
            
            <div className="flex items-center space-x-6 relative z-10 w-full lg:w-auto">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-rose-500 flex-shrink-0">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Emergency Support</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">24/7 designated medical crisis lines</p>
              </div>
            </div>
              
            <div className="flex flex-wrap lg:justify-end gap-4 w-full lg:w-auto relative z-10">
               {[
                  { label: 'Emergency Center', val: '911', bg: 'bg-white', text: 'text-rose-600', hover: 'hover:bg-rose-50' },
                  { label: 'Crisis Support', val: '988', bg: 'bg-rose-600', text: 'text-white', hover: 'hover:bg-rose-700' }
               ].map((node, i) => (
                  <a key={i} href={`tel:${node.val}`} className="flex-1 sm:flex-none">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${node.bg} ${node.text} ${node.hover} px-8 py-4 rounded-2xl flex items-center justify-left sm:justify-start space-x-4 shadow-sm border border-rose-100 transition-all w-full`}
                    >
                       <Phone className="h-5 w-5" />
                       <div className="text-left">
                          <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-80`}>{node.label}</p>
                          <p className="text-xl font-extrabold">{node.val}</p>
                       </div>
                    </motion.button>
                  </a>
               ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
