"use client";

import React from "react";
import Link from "next/link"; // Added Link back

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`block no-underline ${className}`}> {/* Restored Link */}
      <div className="flex items-center gap-4 py-2 transition-all">
        {/* Pro Version Icon Mark (No Typography Design) */}
        <div className="flex justify-center items-center w-12 h-12 shrink-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f3ff" />
                <stop offset="100%" stopColor="#bc13fe" />
              </linearGradient>
            </defs>
            
            {/* Outer spinning ring */}
            <circle 
              className="animate-spin-slow origin-center" 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke="url(#neonGradient)" 
              strokeWidth="6" 
              strokeDasharray="20 10 5 10" 
              opacity="0.9"
            />
            
            {/* Inner counter-spinning ring */}
            <circle 
              className="animate-spin-fast-reverse origin-center" 
              cx="50" cy="50" r="34" 
              fill="none" 
              stroke="#00f3ff" 
              strokeWidth="5" 
              strokeDasharray="100 20" 
              opacity="0.7"
            />
            
            {/* Crosshair markers */}
            <path 
              d="M50 5 L50 20 M50 80 L50 95 M5 50 L20 50 M80 50 L95 50" 
              stroke="#00f3ff" 
              strokeWidth="4" 
              strokeLinecap="round" 
              opacity="0.6"
            />
            
            {/* Central hub - STATIC (Removed pulsing circle) */}
            <circle cx="50" cy="50" r="4" fill="#bc13fe" opacity="0.8" />
          </svg>
        </div>

        {/* Existing Typography Style */}
        <div className="flex flex-col justify-center select-none">
          <div className="text-[1.25rem] font-bold tracking-tight text-white leading-none"> {/* Reverted text color */}
            <span className="font-light text-slate-400">Intern</span>Scope
          </div>
        </div>
      </div>
    </Link>
  );
}
