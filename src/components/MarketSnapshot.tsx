"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Loader from "./Loader"

export default function MarketSnapshot() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/market")
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setData(null);
        } else {
          setData(json)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !data) return (
    <div className="py-24">
      <Loader message="Syncing Live Market Data" />
    </div>
  )

  const stats = [
    { label: "Active Internships", value: data.totalInternships, suffix: "", color: "text-white" },
    { label: "Remote Opportunities", value: data.remoteRatio, suffix: "%", color: "text-[#21D4BD]" },
    { label: "Most In-Demand Skill", value: data.topSkills[0]?.skill || "N/A", suffix: "", color: "text-[#5B6FF6]" }
  ]

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-white tracking-tight uppercase">
            Live Market <span className="text-[#5B6FF6]">Snapshot</span>
          </h2>
          <p className="text-sm text-muted mt-2 opacity-60 uppercase tracking-widest font-medium">Real-time data from {data.totalInternships} curated roles</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-10 rounded-[2.5rem] text-center group hover:bg-white/[0.05] transition-all"
            >
              <div className={`text-3xl font-bold mb-3 tracking-tighter ${stat.color}`}>
                {stat.value}{stat.suffix}
              </div>
              <p className="text-muted text-sm font-medium uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
