'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Shield, Stethoscope, Heart, Activity, Microscope } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => router.push('/'), 500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#f8fafc] text-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Left - Medical Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center p-16 bg-teal-900 overflow-hidden">
        {/* Subtle Branding Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 mb-16 group">
            <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <Stethoscope className="h-7 w-7 text-slate-300" />
            </div>
            <span className="text-2xl text-title text-white">Obvis <span className="text-slate-400">AI</span></span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8 max-w-md"
          >
            <h2 className="text-5xl text-title text-white leading-tight">
              Enterprise <br />
              <span className="text-slate-400">Care Analytics</span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              Secure access to your personal AI medical consultant. Precision diagnostics at your fingertips.
            </p>

            <div className="pt-8 grid grid-cols-1 gap-4">
              {[
                { label: 'Clinical Precision', val: 'Research Backed', icon: Microscope },
                { label: 'Data Security', val: 'HIPAA Standard', icon: Shield },
                { label: 'Live Monitoring', val: 'Real-time Stats', icon: Activity }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <item.icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-white">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 right-8 text-white/20">
          <Heart className="h-32 w-32" />
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <div className="flex items-center space-x-3 mb-6 lg:hidden">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl text-title">Obvis <span className="text-slate-500">AI</span></span>
            </div>
            <h2 className="text-3xl text-title text-slate-900 mb-2">Access Dashboard</h2>
            <p className="text-slate-500 font-medium">Verify your credentials to proceed</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center space-x-3"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative group/input">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-slate-900' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="practitioner@obvis.ai"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative group/input">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-slate-900' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-slate-900 hover:underline transition-colors">
                Register Now
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              By signing in, you agree to our{' '}
              <Link href="#" className="font-semibold text-slate-500 hover:text-slate-800 transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="font-semibold text-slate-500 hover:text-slate-800 transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}


