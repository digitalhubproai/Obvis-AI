'use client';

import { motion } from 'framer-motion';
import { Heart, Brain, Stethoscope, Pill, Activity, Users, Shield, Clock } from 'lucide-react';

const features = [
  {
    title: "13+ Medical Specializations",
    desc: "From Cardiology to Neurology, get expert consultation across all major medical departments.",
    icon: Stethoscope
  },
  {
    title: "AI-Powered Diagnosis",
    desc: "Advanced AI analyzes your symptoms using medical knowledge and provides accurate insights.",
    icon: Brain
  },
  {
    title: "Instant Prescriptions",
    desc: "Get medicine recommendations with proper dosage and usage instructions.",
    icon: Pill
  },
  {
    title: "24/7 Available",
    desc: "Our AI doctors are available round the clock for your health concerns.",
    icon: Clock
  },
  {
    title: "Medical Report Analysis",
    desc: "Upload lab reports, X-rays, and scans for AI-powered analysis.",
    icon: Activity
  },
  {
    title: "Secure & Private",
    desc: "Your health data is encrypted and protected with HIPAA compliance.",
    icon: Shield
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-medical mb-6 inline-flex items-center space-x-2 border-slate-200 bg-white shadow-sm">
            <Heart className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-semibold tracking-wide">Why Choose Obvis</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-title mb-6">
            Complete Healthcare <span className="text-slate-500 font-medium">Platform</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Everything you need for instant medical consultation and health monitoring
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:-translate-y-1 transition-transform duration-300 z-10">
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="relative text-lg font-bold text-slate-900 mb-2 z-10">{item.title}</h3>
              <p className="relative text-sm text-slate-500 leading-relaxed z-10">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
