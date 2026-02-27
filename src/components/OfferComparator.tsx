"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Offer {
  learningScore: number;
  brandScore: number;
  techStackValue: number;
  networkScore: number;
}

export default function OfferComparator() {
  const [offerA, setOfferA] = useState<Offer>({
    learningScore: 3,
    brandScore: 3,
    techStackValue: 3,
    networkScore: 3,
  })

  const [offerB, setOfferB] = useState<Offer>({
    learningScore: 3,
    brandScore: 3,
    techStackValue: 3,
    networkScore: 3,
  })

  const [growthA, setGrowthA] = useState<number | null>(null)
  const [growthB, setGrowthB] = useState<number | null>(null)
  const [isComparing, setIsComparing] = useState(false)

  const compareOffers = async () => {
    setIsComparing(true)
    try {
      const res = await fetch("/api/offers/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerA, offerB })
      })

      if (!res.ok) {
        throw new Error("Failed to compare offers")
      }

      const data = await res.json()
      setGrowthA(data?.growthA ?? 0)
      setGrowthB(data?.growthB ?? 0)
    } catch (err) {
      console.error("Comparison Error:", err)
      alert("Offer comparison failed. Please try again.")
    } finally {
      setIsComparing(false)
    }
  }

  const updateOffer = (setter: React.Dispatch<React.SetStateAction<Offer>>, offer: Offer, field: keyof Offer, value: string) => {
    setter({ ...offer, [field]: parseInt(value) })
  }

  const fields: { key: keyof Offer; label: string }[] = [
    { key: "learningScore", label: "Learning Potential" },
    { key: "brandScore", label: "Brand Recognition" },
    { key: "techStackValue", label: "Tech Stack Future-Proofing" },
    { key: "networkScore", label: "Network/Mentorship" }
  ]

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto bg-[#0F172A]/50 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl mt-20 mb-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#21D4BD] to-transparent opacity-30" />
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight uppercase">Career Growth Optimizer</h2>
        <p className="text-sm text-muted max-w-2xl mx-auto opacity-60">Compare internship offers based on long-term equity and career trajectory, not just monthly stipends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[ {offer: offerA, setter: setOfferA, title: "Offer A", color: "#5B6FF6"},
           {offer: offerB, setter: setOfferB, title: "Offer B", color: "#21D4BD"} ]
          .map(({offer, setter, title, color}) => (
          <div key={title} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 relative group transition-all hover:bg-white/[0.07]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold text-white tracking-widest uppercase">{title}</h3>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            </div>

            <div className="space-y-6">
              {fields.map(field => (
                <div key={field.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted uppercase tracking-wider">{field.label}</label>
                    <span className="text-sm font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded border border-white/10">{offer[field.key]} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={offer[field.key]}
                    onChange={(e) => updateOffer(setter, offer, field.key, e.target.value)}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer transition-all"
                    style={{ accentColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={compareOffers}
          disabled={isComparing}
          className="bg-white text-black hover:bg-white/90 font-black px-12 py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-sm transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isComparing ? "Analyzing Indices..." : "Run Growth Comparison"}
        </button>
      </div>

      <AnimatePresence>
        {growthA !== null && growthB !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-16 space-y-10 pt-10 border-t border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted uppercase tracking-widest">Offer A Index</span>
                  <span className="text-3xl font-bold text-[#5B6FF6]">{growthA}%</span>
                </div>
                <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${growthA}%` }} className="bg-[#5B6FF6] h-full rounded-full shadow-[0_0_15px_rgba(91,111,246,0.4)]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted uppercase tracking-widest">Offer B Index</span>
                  <span className="text-3xl font-bold text-[#21D4BD]">{growthB}%</span>
                </div>
                <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${growthB}%` }} className="bg-[#21D4BD] h-full rounded-full shadow-[0_0_15px_rgba(33,212,189,0.4)]" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#5B6FF6]/20 to-[#21D4BD]/20 p-8 rounded-[2rem] border border-white/10 text-center relative">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Projected Winner</div>
               <p className="text-2xl font-bold text-white tracking-tight">
                {growthA > growthB
                  ? "Offer A provides superior long-term career growth."
                  : growthB > growthA
                  ? "Offer B provides superior long-term career growth."
                  : "Both offers represent identical career trajectories."}
               </p>
               <p className="text-sm text-muted mt-2 max-w-xl mx-auto opacity-60 italic">Based on a 1-year career delta projection. High scores in learning and brand recognition outweigh immediate liquidity.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
