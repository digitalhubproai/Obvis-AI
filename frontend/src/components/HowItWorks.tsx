'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Cpu, ClipboardCheck, Zap, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "1. Describe Symptoms",
    desc: "Simply type your health concerns or upload a medical report (PDF, Image, or Scan) for AI-powered analysis.",
    icon: MessageSquare,
    color: "bg-blue-500",
    shadow: "shadow-blue-200"
  },
  {
    title: "2. AI Specialist Match",
    desc: "Our advanced algorithm instantly identifies the most relevant medical specialization (e.g., Cardiology, ENT) for your case.",
    icon: Cpu,
    color: "bg-teal-500",
    shadow: "shadow-teal-200"
  },
  {
    title: "3. Professional Analysis",
    desc: "The AI Specialist asks targeted questions to understand your condition deeply, providing expert insights and potential diagnosis.",
    icon: ClipboardCheck,
    color: "bg-cyan-500",
    shadow: "shadow-cyan-200"
  },
  {
    title: "4. Recovery Roadmap",
    desc: "Receive a structured recovery plan including medicine suggestions, dosages, and lifestyle changes for faster healing.",
    icon: Zap,
    color: "bg-emerald-500",
    shadow: "shadow-emerald-200"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <div className="badge-medical mb-6 inline-flex items-center space-x-2 border-slate-200 bg-white shadow-sm">
            <Zap className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-semibold tracking-wide">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-title mb-6">
            How It <span className="text-slate-500 font-medium">Works</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Get professional medical insights in four simple steps. Fast, accurate, and always available.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-0.5 bg-slate-100 z-0"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mb-8 shadow-2xl ${step.shadow} group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-8 text-slate-300">
                    <ArrowRight className="h-6 w-6 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block p-1 rounded-[2.5rem] bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"
          >
            <div className="bg-white rounded-[2.4rem] px-8 py-4 flex items-center gap-4">
              <span className="text-slate-600 font-semibold">Ready to start?</span>
              <button className="text-teal-600 font-bold hover:translate-x-1 transition-transform flex items-center gap-1 group">
                Try consultation now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
