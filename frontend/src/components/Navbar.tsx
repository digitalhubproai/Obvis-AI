'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, ChevronDown, Layers, LogOut, User, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <nav className="max-w-7xl mx-auto px-6">
        <div className={`glass-panel px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-lg' : 'bg-white/70 shadow-md'}`}>
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-[0_4px_15px_-4px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform duration-300">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl text-title">
              Obvis <span className="text-teal-600">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {['Features', 'Specializations', 'How It Works', 'Security'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-cyan-50 border border-cyan-200 rounded-xl px-4 py-2 hover:bg-cyan-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center font-bold text-sm text-white">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.name}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </motion.button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-cyan-100 overflow-hidden z-50"
                    >
                      <div className="p-4 bg-cyan-50 border-b border-cyan-100">
                        <p className="text-xs font-semibold text-cyan-700 mb-1">Logged in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center space-x-3 p-4 hover:bg-cyan-50 transition-colors">
                        <Layers className="h-5 w-5 text-cyan-600" />
                        <span className="text-sm font-semibold text-slate-700">Dashboard</span>
                      </Link>
                      <Link href="/history" className="flex items-center space-x-3 p-4 hover:bg-cyan-50 transition-colors">
                        <ClipboardList className="h-5 w-5 text-cyan-600" />
                        <span className="text-sm font-semibold text-slate-700">Consultation History</span>
                      </Link>
                      <Link href="/profile" className="flex items-center space-x-3 p-4 hover:bg-cyan-50 transition-colors">
                        <User className="h-5 w-5 text-cyan-600" />
                        <span className="text-sm font-semibold text-slate-700">Profile</span>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 transition-colors border-t border-cyan-100">
                        <LogOut className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-semibold text-red-600">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup">
                  <button className="btn-premium !px-6 !py-2.5 !text-sm">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
