'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Stethoscope, Heart, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
      {/* Subtle Professional Background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="badge-medical mb-6 inline-flex items-center space-x-2 border-slate-200 bg-white shadow-sm text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
              </span>
              <span className="font-semibold tracking-wide">Enterprise Healthcare Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl text-title leading-tight mb-6">
              Your Personal <br />
              <span className="text-slate-900">AI Doctor</span> <br />
              <span className="text-slate-500 font-medium">Available 24/7</span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Describe your symptoms, get instant consultation from specialist AI doctors across 13+ medical departments. Fast, accurate, and always available.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
              <Link href="/login">
                <button className="btn-premium group w-full sm:w-auto">
                  Start Consultation
                  <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="btn-outline w-full sm:w-auto">
                  How It Works
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 justify-center lg:justify-start text-sm font-semibold text-slate-500 mt-8">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-slate-400" />
                <span>13+ Specializations</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-slate-400" />
                <span>AI-Powered Diagnosis</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                <span>24/7 Available</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="glass-panel p-8 bg-white/80 backdrop-blur-xl border-cyan-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Stethoscope className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">AI Medical Assistant</h3>
                    <p className="text-sm text-slate-500">Ready to help you</p>
                  </div>
                </div>

                {/* Chat Preview */}
                <div className="space-y-4">
                  <div className="bg-cyan-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-700">
                      👋 Hello! I'm your AI health assistant. What symptoms are you experiencing today?
                    </p>
                  </div>
                  <div className="bg-slate-100 rounded-2xl p-4 ml-8">
                    <p className="text-sm text-slate-700">
                      I have a headache and fever since yesterday...
                    </p>
                  </div>
                  <div className="bg-cyan-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-700">
                      I understand. Let me ask you a few questions to better understand your condition...
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 flex gap-2">
                  <div className="px-4 py-2 bg-white border border-cyan-200 rounded-full text-xs text-cyan-700">
                    🤒 Fever
                  </div>
                  <div className="px-4 py-2 bg-white border border-cyan-200 rounded-full text-xs text-cyan-700">
                    💊 Medicine
                  </div>
                  <div className="px-4 py-2 bg-white border border-cyan-200 rounded-full text-xs text-cyan-700">
                    📋 Report
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-cyan-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-slate-700">Online</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-cyan-100"
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-semibold text-slate-700">Heart Rate</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
