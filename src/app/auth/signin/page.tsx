"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import Link from "next/link"
import Logo from "@/components/Logo"

export const dynamic = "force-dynamic"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/"
    })

    if (res?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: "url('/bg-image3.png')" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-none" />
      <div className="mesh-bg opacity-30" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl mt-[85vh]"
      >
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            System <span className="text-[#5B6FF6]">Access</span>
          </h1>
          <p className="text-muted text-sm mt-2 font-medium opacity-60 uppercase tracking-widest">
            Identity verification required
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Email Terminal</label>
            <input 
              type="email" placeholder="name@domain.com" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:ring-2 focus:ring-[#5B6FF6]/50 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Access Key</label>
            <input 
              type="password" placeholder="••••••••" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:ring-2 focus:ring-[#5B6FF6]/50 transition-all outline-none"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-400 text-xs font-bold text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full btn-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm"
          >
            {loading ? "Decrypting..." : "Initialize Session"}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-[#0F172A] px-4 text-muted tracking-[0.3em]">Quantum Auth</span></div>
          </div>

          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.19 3.28-7.91 3.28-11.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            OAuth 2.0 Pipeline
          </button>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-widest text-muted">
          New terminal user?
          <Link 
            href="/"
            className="ml-2 text-[#21D4BD] hover:underline"
          >
            Return to Core
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
