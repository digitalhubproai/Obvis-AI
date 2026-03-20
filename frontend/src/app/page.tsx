'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Specializations from '@/components/Specializations';
import Metrics from '@/components/Metrics';
import Features from '@/components/Features';
import Security from '@/components/Security';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-50 to-white text-slate-800 overflow-x-hidden relative">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Specializations />
      <Metrics />
      <Features />
      <Security />
      <Footer />
    </main>
  );
}
