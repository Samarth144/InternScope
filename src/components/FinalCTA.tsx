"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useSession, signIn } from "next-auth/react"

export default function FinalCTA() {
  const { data: session } = useSession();

  return (
    <section className="py-32 bg-transparent text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[#5B6FF6]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 md:px-8 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight uppercase">
          Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#21D4BD] to-[#5B6FF6]">Stop Guessing?</span>
        </h2>
        
        <p className="text-sm text-muted mb-12 font-medium opacity-60">
          Join hundreds of students using data-driven insights to secure high-growth internships.
        </p>

        {session ? (
          <Link
            href="/simulate"
            className="btn-primary text-xl px-16 py-6 rounded-[2rem] inline-block shadow-[0_0_50px_rgba(91,111,246,0.3)] hover:shadow-[0_0_70px_rgba(91,111,246,0.5)]"
          >
            Start Your Internship Strategy
          </Link>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="btn-primary text-xl px-16 py-6 rounded-[2rem] inline-block shadow-[0_0_50px_rgba(91,111,246,0.3)] hover:shadow-[0_0_70px_rgba(91,111,246,0.5)]"
          >
            Sign In to Start
          </button>
        )}
      </motion.div>
    </section>
  )
}
