"use client"

import ProfileBuilder from "@/components/ProfileBuilder"

export default function SimulatePage() {
  return (
    <div className="relative min-h-screen selection:bg-[#21D4BD] selection:text-black pb-32">
      <div className="mesh-bg" />
      
      <header className="max-w-5xl mx-auto pt-12 mb-16 text-center relative">
        <div className="inline-block bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-[#21D4BD] uppercase tracking-widest mb-6 backdrop-blur-md">
          Market Simulation Engine
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
          Build Your <span className="text-[#5B6FF6]">Strategy</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium opacity-80">
          Enter your profile data to generate a real-time market readiness and acceptance probability report.
        </p>
      </header>
      
      <main>
        <ProfileBuilder />
      </main>
    </div>
  )
}
