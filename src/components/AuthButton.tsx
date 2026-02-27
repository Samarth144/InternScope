"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import AuthModal from "./AuthModal"

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="h-10 w-10 animate-pulse bg-white/5 rounded-full border border-white/10" />
    )
  }

  if (session) {
    return (
      <div className="relative">
        {/* Profile Circle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative w-10 h-10 rounded-full border border-white/10 p-[2px] hover:border-[#5B6FF6]/50 transition-colors overflow-hidden"
        >
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || "User"} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5B6FF6] to-[#7C5CFF] flex items-center justify-center text-sm font-black text-white">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
            </div>
          )}
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <>
              {/* Click outside to close */}
              <div 
                className="fixed inset-0 z-[90]" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-[#0F172A] border border-white/10 rounded-2xl p-4 shadow-2xl z-[100] backdrop-blur-xl"
              >
                <div className="flex flex-col gap-1 mb-4 border-b border-white/5 pb-3">
                  <span className="text-[10px] text-[#21D4BD] font-black uppercase tracking-widest">
                    {(session.user as any).role === 'ADMIN' ? 'Admin Profile' : 'Student Profile'}
                  </span>
                  <span className="text-sm font-bold text-white truncate">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/10 transition-all uppercase tracking-widest"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="bg-white text-black font-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        Sign In
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
