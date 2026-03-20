'use client';

import { Stethoscope, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-16 relative z-10 bg-gradient-to-b from-white to-cyan-50 border-t border-cyan-100 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Obvis <span className="text-cyan-600">AI</span></span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Your trusted AI healthcare platform. Get instant medical consultation from specialist AI doctors, 24/7.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 hover:bg-cyan-200 transition-all cursor-pointer">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Features', 'Specializations', 'How It Works'].map(item => (
                <li key={item}>
                  <Link href={`/#${item.toLowerCase().replace(' ', '-')}`} className="text-slate-600 text-sm hover:text-cyan-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold mb-6">Medical Departments</h4>
            <ul className="space-y-3">
              {['Cardiology', 'Neurology', 'Dermatology', 'General Medicine'].map(item => (
                <li key={item}>
                  <Link href="/login" className="text-slate-600 text-sm hover:text-cyan-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-cyan-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">support@obvis.ai</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-cyan-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-cyan-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">Available Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-cyan-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm">
              © 2026 Obvis AI Healthcare. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-slate-500 text-sm hover:text-cyan-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-slate-500 text-sm hover:text-cyan-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-slate-500 text-sm hover:text-cyan-600 transition-colors">
                Medical Disclaimer
              </Link>
            </div>
          </div>
          
          {/* Medical Disclaimer */}
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-xs leading-relaxed">
              <strong>Medical Disclaimer:</strong> Obvis AI provides health information and consultation services for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions about medical conditions. In case of emergency, call your local emergency number immediately.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
