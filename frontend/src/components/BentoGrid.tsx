'use client';

import { motion } from 'framer-motion';
import { Brain, Video, FileText, Clock, Shield, Stethoscope, ChevronRight, Heart, Pill } from 'lucide-react';

const features = [
  {
    title: "AI Symptom Analysis",
    desc: "Advanced AI analyzes your symptoms using medical knowledge from 13+ specializations.",
    icon: Brain,
    size: "md:col-span-2 md:row-span-2",
    color: "from-cyan-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-cyan-50 to-teal-50"
  },
  {
    title: "24/7 Available",
    desc: "Get medical consultation anytime, day or night.",
    icon: Clock,
    size: "md:col-span-1 md:row-span-1",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
  },
  {
    title: "Medical Reports",
    desc: "Upload and analyze lab reports, X-rays, and scans.",
    icon: FileText,
    size: "md:col-span-1 md:row-span-1",
    color: "from-teal-500 to-green-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-green-50"
  },
  {
    title: "Instant Prescriptions",
    desc: "Get medicine recommendations with dosage information.",
    icon: Pill,
    size: "md:col-span-1 md:row-span-1",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50"
  },
  {
    title: "13+ Specializations",
    desc: "Cardiology, Neurology, Dermatology, and more.",
    icon: Stethoscope,
    size: "md:col-span-2 md:row-span-1",
    color: "from-cyan-600 to-blue-600",
    bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50"
  }
];

export default function BentoGrid() {
  return (
    <section id="features" className="py-20 relative bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-medical mb-6 inline-flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Complete Healthcare <span className="text-gradient">Solution</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Everything you need for instant medical consultation and health monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bento-card flex flex-col justify-between group ${item.bgColor} ${item.size}`}
            >
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-6">
                <span className="text-xs font-semibold text-cyan-700 flex items-center cursor-pointer group-hover:translate-x-1 transition-transform">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
