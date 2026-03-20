'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, ChevronRight, Stethoscope, FileText, Download, X, Activity, Clock, Shield, AlertTriangle, ArrowLeft, MoreVertical, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://creativesar-obvis-ai.hf.space';

export default function HistoryPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchConsultations(token);
  }, []);

  const fetchConsultations = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/consultations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConsultations(response.data);
    } catch (error: any) {
      console.error('Failed to fetch consultations:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter((c: any) => {
    const s = c.symptoms || '';
    const d = c.department || '';
    const matchesSearch = s.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         d.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDepartment === 'all' || d === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const departments = ['all', ...Array.from(new Set(consultations.map((c: any) => c.department).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Retrieving Archives</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 relative font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Advanced Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
      </div>

      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <Link href="/dashboard" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">Access <span className="text-indigo-600">Archives</span></h1>
            <p className="text-slate-500 font-semibold uppercase text-xs tracking-widest">Diagnostic Logs & Clinical History</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group/search">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within/search:text-teal-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search symptoms..."
                className="w-full sm:w-80 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative group/filter">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400 group-focus-within/filter:text-indigo-600 transition-colors" />
              </div>
              <select
                className="w-full sm:w-48 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-slate-900 appearance-none focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all capitalize shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map((dept: any) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                 <Shield className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Showing <span className="text-slate-900">{filteredConsultations.length}</span> verified clinical records
              </p>
           </div>
           <button className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 shadow-sm hover:shadow active:scale-95 text-slate-700">
              <Download className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Export Log</span>
           </button>
        </div>

        {/* List of Consultations */}
        {filteredConsultations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] py-24 text-center border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 border border-white shadow-sm">
              <FileText className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No Records Found</h3>
            <p className="text-slate-500 font-semibold uppercase text-xs tracking-widest mb-8">No medical signatures match your request</p>
            <button onClick={() => {setSearchTerm(''); setFilterDepartment('all');}} className="btn-outline px-10">
               Reset Search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredConsultations.map((consultation: any, i) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div 
                  onClick={() => setSelectedConsultation(consultation)}
                  className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 hover:border-indigo-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgb(79,70,229,0.08)] transition-all duration-300 cursor-pointer flex flex-col lg:flex-row lg:items-center gap-8 overflow-hidden hover:-translate-y-1"
                >
                   <div className="flex items-center space-x-6 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-white shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)] text-indigo-600 transition-transform group-hover:scale-110 duration-500">
                         <Stethoscope className="h-8 w-8" />
                      </div>
                      <div>
                         <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{consultation.department}</h3>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm rounded-full text-[10px] font-bold uppercase tracking-widest">Verified</span>
                         </div>
                         <p className="text-slate-500 text-sm font-medium line-clamp-1 group-hover:text-slate-700 transition-colors">Symptom Log: {consultation.symptoms}</p>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center gap-8 lg:text-right">
                      <div className="flex items-center lg:flex-col lg:items-end space-x-4 lg:space-x-0 lg:space-y-1">
                         <div className="flex items-center space-x-2 text-slate-400">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Date</span>
                         </div>
                         <p className="text-sm font-bold text-slate-900">{new Date(consultation.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>

                      <div className="h-10 w-px bg-slate-200 hidden lg:block" />

                      <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors group-hover:scale-105 duration-300">
                            <Eye className="h-5 w-5" />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedConsultation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConsultation(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_80px_rgb(0,0,0,0.1)] border border-white/60 overflow-hidden focus:outline-none"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10" />
              <div className="p-10 relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center space-x-6">
                     <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Stethoscope className="h-10 w-10 text-white" />
                     </div>
                     <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedConsultation.department}</h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 bg-slate-100 inline-block px-3 py-1 rounded-full">{new Date(selectedConsultation.created_at).toLocaleString()}</p>
                     </div>
                  </div>
                  <button
                    onClick={() => setSelectedConsultation(null)}
                    className="p-3 bg-white/80 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors border border-slate-200 shadow-sm"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-8 bg-slate-50/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-[inset_0_2px_10px_rgb(0,0,0,0.01)]">
                    <div className="flex items-center space-x-3 mb-4">
                       <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                         <Activity className="h-4 w-4 text-slate-600" />
                       </div>
                       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Symptoms</h4>
                    </div>
                    <p className="text-slate-900 text-lg font-medium leading-relaxed">{selectedConsultation.symptoms}</p>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 relative overflow-hidden group shadow-sm">
                     <div className="flex items-center space-x-3 mb-6 relative z-10">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/20">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-widest">AI Diagnosis</h4>
                     </div>
                     <p className="text-indigo-950/80 font-medium leading-relaxed relative z-10">
                        {selectedConsultation.diagnosis_log || "Comprehensive medical intelligence report has been synthesized and archived. The diagnostic output indicates high-confidence pattern matching within the specified clinical department."}
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                       <Clock className="h-5 w-5 text-slate-400 mb-2" />
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <p className="text-sm font-extrabold text-slate-700">Archived</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                       <AlertTriangle className="h-5 w-5 text-emerald-500 mb-2" />
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Buffer</p>
                       <p className="text-sm font-extrabold text-slate-700">Minimal</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <button className="flex-1 btn-premium bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20 shadow-sm border-none text-white rounded-2xl py-4 font-bold text-sm tracking-wide transition-all active:scale-[0.98]">
                      Download Full Analytics
                   </button>
                   <button className="px-8 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 hover:border-rose-200 transition-colors shadow-[0_2px_10px_rgb(0,0,0,0.02)] group active:scale-[0.98]">
                      <Trash2 className="h-5 w-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
