"use client"

import { motion } from "framer-motion"

export default function HowItWorks() {
  const steps = [
    { num: "1", title: "Build Profile", desc: "Enter your skills, projects, and target role into our intelligence engine." },
    { num: "2", title: "Simulate Market", desc: "Instantly see competition intensity and your real acceptance probability." },
    { num: "3", title: "Optimize Strategy", desc: "Improve target skills and compare multiple offers with 1-year career projections." }
  ]

  return (
    <section className="py-32 bg-white/5 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-semibold text-center text-white mb-20 tracking-tight uppercase">
          How It <span className="text-[#5B6FF6]">Works</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-16 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {steps.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center relative z-10"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#5B6FF6] to-[#7C5CFF] text-white flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-[0_0_30px_rgba(91,111,246,0.4)]">
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
              <p className="text-sm text-muted font-medium leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

