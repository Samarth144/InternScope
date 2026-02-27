"use client"

import { motion } from "framer-motion"

export default function FeaturesSection() {
  const features = [
    {
      title: "Acceptance Simulator",
      icon: "📊",
      desc: "Calculates your internship acceptance probability based on real skill modeling."
    },
    {
      title: "Market Intelligence",
      icon: "🧠",
      desc: "Models competition pressure for different roles and company tiers."
    },
    {
      title: "Offer Growth Optimizer",
      icon: "🚀",
      desc: "Compares long-term career impact of internship offers side-by-side."
    }
  ]

  return (
    <section className="py-32 bg-transparent relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <h2 className="text-2xl font-semibold text-white tracking-tight uppercase">
            What <span className="text-[#21D4BD]">InternScope</span> Does
          </h2>
          <p className="text-sm text-muted mt-4 opacity-60">Powerful tools built for the next generation of engineers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-white/[0.02] rounded-3xl border border-white/[0.05] hover:border-[#5B6FF6]/20 transition-all group"
            >
              <div className="text-4xl mb-6 transform group-hover:-translate-y-1 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed font-normal opacity-70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

