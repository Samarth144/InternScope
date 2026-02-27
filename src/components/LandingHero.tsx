"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useSession, signIn } from "next-auth/react"

export default function LandingHero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/bg-image3.png')" }}>
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
          Stop Guessing.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#21D4BD] to-[#5B6FF6]">Start Strategizing.</span>
        </h1>

        <p className="mt-6 text-sm md:text-base text-muted max-w-xl mx-auto font-normal leading-relaxed opacity-70">
          Analyze your profile, model market competition, and choose the
          internship that builds your career — not just your stipend.
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center">
          {session ? (
            <>
              <Link
                href="/simulate"
                className="btn-primary text-lg px-12 py-5"
              >
                Start Your Simulation
              </Link>

              <Link
                href="/dashboard"
                className="btn-secondary text-lg px-12 py-5"
              >
                View History
              </Link>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="btn-primary text-lg px-12 py-5 flex items-center gap-3 justify-center"
            >
              Sign In to Start Simulation
            </button>
          )}
        </div>
      </motion.div>
    </section>
  )
}
