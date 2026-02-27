"use client"

import { motion } from "framer-motion"

export default function ProblemSection() {
  const problems = [
    "Students apply blindly without knowing their real readiness.",
    "No one models how competitive the market truly is.",
    "Most decisions are based only on stipend — not long-term growth."
  ]

  return (
    <section className="py-32 bg-white/5 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#21D4BD] to-transparent opacity-20" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-12 tracking-tight uppercase">
          The Internship Problem <span className="text-[#5B6FF6]">Nobody Solves</span>
        </h2>

        <div className="space-y-6">
          {problems.map((text, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 text-left bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:border-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 font-bold shrink-0 text-sm">!</div>
              <p className="text-sm text-muted font-normal">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
