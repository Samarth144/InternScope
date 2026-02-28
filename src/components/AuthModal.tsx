"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [mode, setStep] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }
      // Auto login after register
      await signIn("credentials", { email, password, callbackUrl: "/" })
    } else {
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
        onClose()
        window.location.reload()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#071033]/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#0F172A] border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden mt-[85vh]"
      >
        <div className="mesh-bg opacity-30" />
        
        <div className="relative z-10">
          <header className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted text-sm mt-2">
              {mode === "login" ? "Access your career intelligence dashboard" : "Join the next generation of technical talent"}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <input 
                type="text" placeholder="Full Name" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:ring-2 focus:ring-[#5B6FF6]/50"
              />
            )}
            <input 
              type="email" placeholder="Email Address" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:ring-2 focus:ring-[#5B6FF6]/50"
            />
            <input 
              type="password" placeholder="Password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:ring-2 focus:ring-[#5B6FF6]/50"
            />

            {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}

            <button 
              type="submit" disabled={loading}
              className="w-full btn-primary py-4 rounded-xl"
            >
              {loading ? "Processing..." : (mode === "login" ? "Sign In" : "Register")}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0F172A] px-2 text-muted font-bold">Or continue with</span></div>
            </div>

            <button 
              onClick={() => signIn("google")}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.19 3.28-7.91 3.28-11.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
          </div>

          <p className="text-center mt-8 text-xs text-muted">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setStep(mode === "login" ? "register" : "login")}
              className="ml-2 text-[#21D4BD] font-bold hover:underline"
            >
              {mode === "login" ? "Create one" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
