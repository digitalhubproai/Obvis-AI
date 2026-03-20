'use client';

import { motion } from 'framer-motion';
import { 
  Heart, Brain, Stethoscope, Pill, Activity, Users, Shield, Clock, 
  Baby, Eye, Info, FlaskConical,
  Thermometer, Bone, Microscope, Wind, Stethoscope as stethoscopeIcon
} from 'lucide-react';

const specializations = [
  { id: 'cardiology', name: 'Cardiology', icon: Heart, desc: 'Heart and cardiovascular system specialist' },
  { id: 'neurology', name: 'Neurology', icon: Brain, desc: 'Brain and nervous system specialist' },
  { id: 'dermatology', name: 'Dermatology', icon: stethoscopeIcon, desc: 'Skin, hair, and nails specialist' },
  { id: 'orthopedics', name: 'Orthopedics', icon: Bone, desc: 'Bones, joints, muscles, and ligaments specialist' },
  { id: 'gastroenterology', name: 'Gastroenterology', icon: Activity, desc: 'Digestive system specialist' },
  { id: 'pulmonology', name: 'Pulmonology', icon: Wind, desc: 'Respiratory system and lungs specialist' },
  { id: 'endocrinology', name: 'Endocrinology', icon: Thermometer, desc: 'Hormones and endocrine system specialist' },
  { id: 'urology', name: 'Urology', icon: FlaskConical, desc: 'Urinary tract and reproductive system specialist' },
  { id: 'gynecology', name: 'Gynecology', icon: Users, desc: "Women's reproductive health specialist" },
  { id: 'pediatrics', name: 'Pediatrics', icon: Baby, desc: 'Child health specialist' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, desc: 'Eye and vision specialist' },
  { id: 'ent', name: 'ENT', icon: stethoscopeIcon, desc: 'Ear, nose, and throat specialist' },
  { id: 'general', name: 'General Physician', icon: Stethoscope, desc: 'General health and primary care' }
];

export default function Specializations() {
  return (
    <section id="specializations" className="py-24 bg-slate-50 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-100 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-100 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="badge-medical mb-6 inline-flex items-center space-x-2 border-slate-200 bg-white shadow-sm">
            <Stethoscope className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-semibold tracking-wide">Expert Medical Care</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-title mb-6">
            13+ Medical <span className="text-teal-600">Specializations</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Get instant consultation from specialist AI doctors across all major medical departments, trained on massive clinical datasets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {specializations.map((spec, i) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col items-center text-center h-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-teal-50 transition-colors duration-300 group-hover:scale-110 transform transition-transform">
                <spec.icon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{spec.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {spec.desc}
              </p>
              <div className="mt-auto pt-4 flex items-center text-xs font-bold text-teal-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <Activity className="ml-2 h-3 w-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
