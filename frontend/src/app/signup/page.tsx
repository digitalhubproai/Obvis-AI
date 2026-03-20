'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, Shield, Stethoscope, Heart, Activity, Phone, Calendar, UserRound, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://creativesar-obvis-ai.hf.space';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', age: '', gender: '', acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!formData.acceptTerms) { setError('Please accept the Terms of Service'); return; }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name, email: formData.email, password: formData.password,
        phone: formData.phone || undefined, age: formData.age ? parseInt(formData.age) : undefined, gender: formData.gender || undefined
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => router.push('/'), 500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
              Start Your <br />
              <span className="text-slate-400">Health Journey</span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              Join thousands of patients getting instant AI-powered medical consultation. Your health, simplified.
            </p>

            <div className="pt-8 grid grid-cols-1 gap-4">
              {[
                { text: 'Free to Get Started', icon: Heart },
                { text: '24/7 Medical Support', icon: Activity },
                { text: 'Secure & Private', icon: Shield }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <item.icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">{item.text}</span>
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

      {/* Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="w-full max-w-2xl py-8"
        >
          <div className="mb-10">
            <div className="flex items-center space-x-3 mb-6 lg:hidden">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl text-title">Obvis <span className="text-slate-500">AI</span></span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Link>
              <h2 className="text-3xl text-title text-slate-900">Create Account</h2>
            </div>
            <p className="text-slate-500 pl-11">Start your free health consultation today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
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

            <div className="grid md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'name' ? 'text-slate-900' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-slate-900' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-slate-900' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Min 8 characters"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
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

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Repeat password"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone (Opt)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555)"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm text-sm"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Age (Opt)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Age"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm text-sm"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 appearance-none cursor-pointer shadow-sm text-sm"
                  >
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="py-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-5 h-5 bg-white border border-slate-300 rounded focus:ring-slate-400 checked:bg-teal-600 checked:border-teal-600 transition-all appearance-none cursor-pointer shadow-sm"
                  />
                  {formData.acceptTerms && <CheckCircle className="absolute h-3 w-3 text-white left-1 pointer-events-none" />}
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">
                  I agree to the <Link href="#" className="font-semibold text-slate-900 hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold text-slate-900 hover:underline">Privacy Policy</Link>
                </span>
              </label>
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
                  Create Account <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-slate-900 hover:underline transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
