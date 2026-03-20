'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, FileCheck, Server } from 'lucide-react';

const securityFeatures = [
  { title: 'HIPAA Compliant', icon: Shield, desc: 'Full healthcare regulatory compliance.' },
  { title: 'End-to-End Encryption', icon: Lock, desc: 'AES-256 encryption for all data.' },
  { title: 'Certified Security', icon: FileCheck, desc: 'Third-party audited infrastructure.' },
  { title: 'Secure Cloud Storage', icon: Server, desc: 'Encrypted medical record storage.' }
];

export default function Security() {
  return (
    <section id="security" className="py-20 relative bg-white overflow-hidden px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-medical mb-6 inline-flex items-center space-x-2 border-slate-200 bg-white shadow-sm">
            <Shield className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-semibold tracking-wide">Healthcare Security Standards</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-title mb-6 text-slate-900">
            Your Data is <span className="text-slate-500 font-medium">Secure</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Built with enterprise-grade security to protect your sensitive medical information
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-100 transition-colors duration-300">
                <item.icon className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs" />
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">Trusted by 10,000+ patients</p>
              <p className="text-xs font-medium text-slate-500">Secure consultations delivered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
