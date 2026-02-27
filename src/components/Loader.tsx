"use client"

import { motion } from "framer-motion"

export default function Loader({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="relative w-20 h-20 flex justify-center items-center">
        {/* Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rounded-full border-4 border-transparent border-t-[#5B6FF6] border-r-[#7C5CFF]"
        />
        
        {/* Inner Ring (Reverse) */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-[65%] h-[65%] rounded-full border-4 border-transparent border-b-[#21D4BD] border-l-[#5B6FF6]"
        />
        
        {/* Central Hub */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 bg-[#5B6FF6] rounded-full shadow-[0_0_15px_#5B6FF6]"
        />
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] font-black text-muted uppercase tracking-[0.3em] animate-pulse"
      >
        {message}
      </motion.p>
    </div>
  )
}
