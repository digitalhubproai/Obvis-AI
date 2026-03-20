'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Users, Clock, FileCheck } from 'lucide-react';

const stats = [
  { label: 'Diagnostic Accuracy', val: '99.9%', icon: CheckCircle },
  { label: 'Happy Patients', val: '10,000+', icon: Users },
  { label: 'Avg. Response Time', val: '< 30 sec', icon: Clock },
  { label: 'Reports Analyzed', val: '50,000+', icon: FileCheck }
];

export default function Metrics() {
  return (
    <section className="py-16 relative z-10 bg-white border-y border-slate-100 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group p-6"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 mx-auto mb-6 flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-300">
                <s.icon className="h-6 w-6 text-slate-700" />
              </div>
              <div className="text-4xl md:text-5xl text-title mb-2 text-slate-900">
                {s.val}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-3">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
