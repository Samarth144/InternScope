"use client";

import OfferComparator from "@/components/OfferComparator"

export default function ComparePage() {
  return (
    <div className="relative min-h-screen selection:bg-[#21D4BD] selection:text-black">
      <div className="mesh-bg" />

      <header className="max-w-5xl mx-auto pt-12 mb-8 text-center relative">
        <div className="inline-block bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-[#21D4BD] uppercase tracking-widest mb-6 backdrop-blur-md">
          Career Strategy Tools
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
          Offer <span className="text-[#5B6FF6]">Comparator</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium opacity-80">
          Quantify the long-term value of your internship offers beyond just the monthly stipend.
        </p>
      </header>
      
      <main className="pb-32">
        <OfferComparator />
      </main>

      <footer className="max-w-5xl mx-auto py-12 border-t border-white/5 text-center opacity-40">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
          Long-term Growth Index Projection v1.0
        </p>
      </footer>
    </div>
  )
}
