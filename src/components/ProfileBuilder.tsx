"use client"

import { useState, useMemo, useEffect } from "react"
import SkillRadarChart from "./charts/SkillRadarChart"
import CompetitionMeter from "./CompetitionMeter"
import { motion, AnimatePresence } from "framer-motion"
import jsPDF from "jspdf"
import { Bar } from "react-chartjs-2"
import { useSession, signIn } from "next-auth/react"
import Loader from "./Loader"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MatchCard({ match, type = "actual", onView }: { match: any, type?: "actual" | "simulated", onView: (m: any) => void }) {
  const isHighMatch = match.matchScore >= 75;
  const accentColor = type === "actual" ? (isHighMatch ? "#21D4BD" : "#5B6FF6") : "#21D4BD";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true }}
      className="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 group overflow-hidden flex flex-col h-full"
    >
      {/* Background Glow Effect */}
      <div 
        className="absolute -right-16 -top-16 w-48 h-48 blur-[100px] rounded-full opacity-10 group-hover:opacity-30 transition-all duration-700"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top: Match Score & Tag */}
        <div className="flex justify-between items-start mb-8">
          <div 
            className="px-4 py-1.5 rounded-full border text-center transition-all duration-500 group-hover:scale-110"
            style={{ 
              backgroundColor: `${accentColor}10`, 
              borderColor: `${accentColor}30`,
              boxShadow: `0 0 20px ${accentColor}15`
            }}
          >
            <span className="text-lg font-black" style={{ color: accentColor }}>{match.matchScore}%</span>
            <span className="text-[9px] font-black uppercase tracking-widest ml-2 opacity-60" style={{ color: accentColor }}>
              {type === "simulated" ? "Proj" : "Match"}
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
             <span className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-tighter">Verified</span>
          </div>
        </div>

        {/* Middle: Company & Role */}
        <div className="space-y-3 mb-8">
          <h3 className="text-2xl font-black text-white group-hover:text-white transition-colors tracking-tight uppercase leading-tight">
            {match.company}
          </h3>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider">{match.role}</span>
            <span className="text-xs font-medium text-[#94A3B8]/50 uppercase">{match.location}</span>
          </div>
        </div>

        {/* Bottom: Stipend & Action (Pushed to bottom) */}
        <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2 opacity-40">Monthly Stipend</span>
            <div className="text-lg font-black text-white">
              ₹{(match?.stipendMin ?? 0).toLocaleString()} <span className="text-[#94A3B8]/30 mx-1">—</span> ₹{(match?.stipendMax ?? 0).toLocaleString()}
            </div>
          </div>

          <button 
            onClick={() => onView(match)}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/10 group-hover:bg-white/10 group-hover:border-white/20 flex items-center justify-center gap-2"
            style={{ color: accentColor }}
          >
            View Opportunity 
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DetailModal({ match, onClose }: { match: any, onClose: () => void }) {
  const accentColor = "#5B6FF6"; // Using primary indigo

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto no-scrollbar">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="min-h-screen flex items-start justify-center p-4 md:p-8 pt-12 md:pt-20">
        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-4xl bg-[#0B112B] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden mb-12"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#5B6FF6]/5 to-transparent pointer-events-none" />
          
          {/* Header Section */}
          <div className="relative p-8 md:p-12 border-b border-white/10">
            <div className="absolute top-0 right-0 p-6">
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#5B6FF6] to-[#7C5CFF] flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-[0_0_30px_rgba(91,111,246,0.3)]">
                {match.company.charAt(0)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">{match.company}</h2>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-400 uppercase tracking-widest">Actively Hiring</span>
                </div>
                <p className="text-xl font-bold text-[#94A3B8] uppercase tracking-widest">{match.role}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Left: Key Information */}
              <div className="md:col-span-2 space-y-12">
                <section>
                  <h4 className="text-[10px] font-black text-[#5B6FF6] uppercase tracking-[0.2em] mb-6">Description</h4>
                  <div className="space-y-4 text-[#94A3B8] leading-relaxed">
                    <p>
                      Join {match.company} as a {match.role} for a high-impact internship. We are looking for candidates who are passionate about building scalable solutions and contributing to our core technology stack.
                    </p>
                    <p>
                      This is a {match.remoteType === "Remote" ? "fully remote" : "onsite"} position based in {match.location}. You will work closely with our engineering team to develop, test, and deploy features that reach thousands of users.
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-[#5B6FF6] uppercase tracking-[0.2em] mb-6">Target Technical Stack</h4>
                  <div className="flex flex-wrap gap-3">
                    {match.skills && match.skills.length > 0 ? (
                      match.skills.map((skill: string) => (
                        <span key={skill} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider">Engineering Principles</span>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider">System Architecture</span>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider">Technical Problem Solving</span>
                      </>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-[#5B6FF6] uppercase tracking-[0.2em] mb-6">Why This Opportunity?</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Direct mentorship from senior engineers",
                      "Exposure to high-scale production systems",
                      "Opportunity for pre-placement offer (PPO)",
                      "Collaborative and innovative work culture"
                    ].map(benefit => (
                      <li key={benefit} className="flex items-center gap-3 text-xs font-medium text-[#94A3B8]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#21D4BD]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Right: Score & Meta */}
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center space-y-4">
                  <div className="text-[10px] font-black text-[#21D4BD] uppercase tracking-widest mb-2">Match Intensity</div>
                  <div className="text-6xl font-black text-white">{match.matchScore}%</div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-gradient-to-r from-[#5B6FF6] to-[#21D4BD]" 
                       style={{ width: `${match.matchScore}%` }}
                     />
                  </div>
                  <p className="text-[10px] text-[#94A3B8] font-medium leading-relaxed italic">
                    Your profile exceeds the technical requirements for this role by {Math.max(0, match.matchScore - 50)} points.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Duration</span>
                    <span className="text-xs font-bold text-white">6 Months</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Stipend Avg</span>
                    <span className="text-xs font-bold text-[#21D4BD]">₹{Math.round((match.stipendMin + match.stipendMax) / 2).toLocaleString()}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Location</span>
                    <span className="text-xs font-bold text-white">{match.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-8 border-t border-white/10">
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProfileBuilder() {
  const [step, setStep] = useState(1)
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loadingResults, setLoadingResults] = useState(false)
  
  // Modal State
  const [selectedInternship, setSelectedInternship] = useState<any | null>(null)
  
  // Pagination State
  const [matchPage, setMatchPage] = useState(1)
  const [simMatchPage, setSimMatchPage] = useState(1)
  const itemsPerPage = 6

  // Core Profile State
  const [skills, setSkills] = useState(Array(10).fill(5))
  const [cgpa, setCgpa] = useState(8.5)
  const [projects, setProjects] = useState(2)
  const [internships, setInternships] = useState(0)
  const [role, setRole] = useState("SDE")
  const [availableRoles, setAvailableRoles] = useState<string[]>(["SDE", "ML", "Data", "Embedded"])
  const [tier, setTier] = useState("MNC")

  // Results State
  const [readiness, setReadiness] = useState<number | null>(null)
  const [competition, setCompetition] = useState<number | null>(null)
  const [probability, setProbability] = useState<number | null>(null)
  const [confidenceLevel, setConfidenceLevel] = useState<string | null>(null)
  const [marketPercentile, setMarketPercentile] = useState<number | null>(null)
  const [topMatches, setTopMatches] = useState<any[]>([])

  // Simulation (ROI) State
  const [simulatedSkills, setSimulatedSkills] = useState(Array(10).fill(5))
  const [simulatedProbability, setSimulatedProbability] = useState<number | null>(null)
  const [simulatedTopMatches, setSimulatedTopMatches] = useState<any[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  const skillNames = [
    "DSA", "Algorithms", "System Design", "React",
    "Node", "Python", "SQL", "ML",
    "Data Analysis", "Embedded"
  ]

  useEffect(() => {
    // Fetch dynamic roles from DB
    fetch("/api/market/roles")
      .then(res => res.json())
      .then(data => {
        if (data.roles && data.roles.length > 0) {
          setAvailableRoles(data.roles);
          if (!data.roles.includes(role)) {
            setRole(data.roles[0]);
          }
        }
      })
      .catch(err => console.error("Failed to fetch roles:", err));
  }, []);

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false)

  const updateSkill = (index: number, value: number) => {
    const updated = [...skills]
    updated[index] = value
    setSkills(updated)
  }

  const calculate = async () => {
    setError(null)
    if (!session) {
      setError("Please sign in to run simulations and save history.")
      return
    }

    // Strict Frontend Validation
    if (cgpa < 0 || cgpa > 10) {
      setError("CGPA must be between 0 and 10.")
      return
    }
    if (projects < 0) {
      setError("Projects count cannot be negative.")
      return
    }
    if (internships < 0) {
      setError("Internships count cannot be negative.")
      return
    }

    setLoadingResults(true)
    try {
      const skillAvg = (skills.reduce((a, b) => a + b, 0) / skills.length) * 10
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          skillAvg, projects, internships, cgpa, role, tier, 
          ...skills.reduce((acc, val, idx) => ({...acc, [skillNames[idx].toLowerCase()]: val}), {}) 
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "An error occurred during simulation.")
        setLoadingResults(false)
        return
      }

      setReadiness(data?.readiness ?? 0)
      setCompetition(data?.competitionIndex ?? 0)
      setProbability(data?.acceptanceProbability ?? 0)
      setConfidenceLevel(data?.confidenceLevel ?? "Moderate")
      setMarketPercentile(data?.marketPercentile ?? 50)
      setTopMatches(data?.topMatches || [])
      
      // Reset pagination
      setMatchPage(1)
      setSimMatchPage(1)
      
      // Initialize simulation with current state
      setSimulatedSkills([...skills])
      setSimulatedProbability(data?.acceptanceProbability ?? 0)
      setSimulatedTopMatches(data?.topMatches || [])
      
      setLoadingResults(false)
      setStep(2) // Move to results
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
      setLoadingResults(false)
    }
  }

  const simulateSkillChange = async (index: number, value: number) => {
    setError(null)
    setIsSimulating(true)
    try {
      const updated = [...simulatedSkills]
      updated[index] = value
      setSimulatedSkills(updated)
      const skillAvg = (updated.reduce((a, b) => a + b, 0) / updated.length) * 10
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          skillAvg, projects, internships, cgpa, role, tier,
          ...updated.reduce((acc, val, idx) => ({...acc, [skillNames[idx].toLowerCase()]: val}), {})
        })
      })
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "Simulation update failed.")
        setIsSimulating(false)
        return
      }

      setSimulatedProbability(data?.acceptanceProbability ?? 0)
      setSimulatedTopMatches(data?.topMatches || [])
      setConfidenceLevel(data?.confidenceLevel ?? "Moderate")
      setMarketPercentile(data?.marketPercentile ?? 50)
    } catch (err) {
      setError("Failed to update simulation. Please try again.")
    } finally {
      setIsSimulating(false)
    }
  }

  const delta = useMemo(() => {
    if (probability === null || simulatedProbability === null) return 0
    return simulatedProbability - probability
  }, [probability, simulatedProbability])

  // Bulk State
  const [bulkData, setBulkData] = useState<number[]>([])
  const [isRunningBulk, setIsRunningBulk] = useState(false)

  const runBulk = async () => {
    setIsRunningBulk(true)
    setLoadingResults(true)
    const res = await fetch("/api/simulate-bulk")
    const data = await res.json()
    setBulkData(data.results)
    setIsRunningBulk(false)
    setLoadingResults(false)
    setStep(4)
  }

  const exportReport = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    
    // 1. Header
    doc.setFillColor(7, 16, 51)
    doc.rect(0, 0, pageWidth, 40, 'F')
    
    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text("INTERNSCOPE", margin, 20)
    
    doc.setFontSize(10)
    doc.setTextColor(33, 212, 189)
    doc.text("INTELLIGENCE REPORT v1.0", margin, 30)
    
    // 2. Profile Summary
    let y = 55
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.text("Candidate Profile Summary", margin, y)
    y += 2
    doc.setDrawColor(91, 111, 246)
    doc.setLineWidth(0.5)
    doc.line(margin, y, 100, y)
    y += 10
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Target Role: ${role}`, margin, y)
    doc.text(`Target Tier: ${tier}`, margin + 80, y)
    y += 7
    doc.text(`CGPA: ${cgpa}/10`, margin, y)
    doc.text(`Projects: ${projects}`, margin + 40, y)
    doc.text(`Internships: ${internships}`, margin + 80, y)
    y += 15
    
    // 3. High Level Metrics
    doc.setFillColor(248, 250, 252)
    doc.rect(margin, y, pageWidth - (margin * 2), 35, 'F')
    
    let metricY = y + 15
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Readiness", margin + 10, metricY)
    doc.text("Competition", margin + 60, metricY)
    doc.text("Probability", margin + 115, metricY)
    
    metricY += 10
    doc.setFontSize(18)
    doc.setTextColor(91, 111, 246)
    doc.text(`${readiness}%`, margin + 10, metricY)
    doc.setTextColor(239, 68, 68) 
    doc.text(`${competition}%`, margin + 60, metricY)
    doc.setTextColor(34, 197, 94) 
    doc.text(`${probability}%`, margin + 115, metricY)
    
    y += 50
    
    // 4. Skill Breakdown
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Technical Skill Breakdown", margin, y)
    y += 10
    
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    const half = Math.ceil(skillNames.length / 2)
    for (let i = 0; i < skillNames.length; i++) {
      const col = i < half ? 0 : 1
      const row = i < half ? i : i - half
      const xPos = margin + (col * 80)
      const yPos = y + (row * 7)
      doc.text(`${skillNames[i]}: ${skills[i]}/10`, xPos, yPos)
      
      doc.setDrawColor(230, 230, 230)
      doc.rect(xPos + 40, yPos - 3, 30, 3)
      doc.setFillColor(91, 111, 246)
      doc.rect(xPos + 40, yPos - 3, (skills[i] / 10) * 30, 3, 'F')
    }
    
    y += (half * 7) + 15
    
    // 5. Internship Matches
    const matchesToExport = topMatches.length > 0 ? topMatches : [];
    if (matchesToExport.length > 0) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Top Curated Internship Matches", margin, y)
      y += 10
      
      matchesToExport.forEach((match, idx) => {
        if (y > 260) { doc.addPage(); y = 20; }
        
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(33, 212, 189) // Secondary Teal/Cyan
        doc.text(`${idx + 1}. ${match.company}`, margin, y)
        
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100, 100, 100)
        doc.text(`${match.role} | ${match.location}`, margin + 5, y + 5)
        
        doc.setTextColor(33, 212, 189) // Match score also cyan
        doc.setFont("helvetica", "bold")
        doc.text(`${match.matchScore}% Match`, pageWidth - margin - 25, y + 2.5)
        
        y += 15
        doc.setDrawColor(240, 240, 240)
        doc.line(margin, y - 3, pageWidth - margin, y - 3)
      })
    }
    
    // 6. Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    const date = new Date().toLocaleString()
    doc.text(`Generated on ${date}`, margin, 285)
    doc.text("InternScope Proprietary Career Intelligence Engine", pageWidth - margin - 70, 285)
    
    doc.save(`InternScope_Report_${role.replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-[#0F172A]/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl mt-12 mb-20 relative overflow-hidden">
      <AnimatePresence>
        {loadingResults && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center"
          >
            <Loader message="Running Intelligence Models..." />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto mb-16 relative z-20">
        <div className="flex justify-between items-center relative">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10 -z-10" />
          {/* Active Progress Line */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((step - 1) / 2) * 100}%` }}
            className="absolute top-5 left-0 h-[2px] bg-[#5B6FF6] shadow-[0_0_10px_rgba(91,111,246,0.5)] -z-10 transition-all duration-500"
          />

          {[
            { s: 1, label: "Discovery", sub: "Profile Data" },
            { s: 2, label: "Intelligence", sub: "Market Analysis" },
            { s: 3, label: "ROI Strategy", sub: "Growth Model" }
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center gap-3">
              <motion.div 
                animate={{ 
                  scale: step === item.s ? 1.1 : 1,
                  backgroundColor: step >= item.s ? "#5B6FF6" : "rgba(255,255,255,0.05)"
                }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all border-2 ${
                  step >= item.s 
                    ? 'border-[#5B6FF6] text-white shadow-[0_0_20px_rgba(91,111,246,0.4)]' 
                    : 'border-white/10 text-[#94A3B8]/40'
                }`}
              >
                {step > item.s ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : item.s}
              </motion.div>
              <div className="text-center space-y-0.5">
                <p className={`text-[10px] font-black uppercase tracking-widest ${step >= item.s ? 'text-white' : 'text-[#94A3B8]/40'}`}>
                  {item.label}
                </p>
                <p className="text-[8px] font-bold text-[#94A3B8]/40 uppercase hidden md:block">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight uppercase">1. Profile Discovery</h1>
              <p className="text-sm text-[#94A3B8] opacity-60">Input your current technical standing and academic credentials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <SkillRadarChart skills={skills.map(s => s * 10)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {skillNames.map((name, i) => (
                  <div key={name} className="group flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] group-hover:text-[#5B6FF6] transition-colors">
                        {name}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{skills[i]}</span>
                        <span className="text-[10px] text-[#94A3B8] font-medium opacity-50">/ 10</span>
                      </div>
                    </div>
                    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                      {/* Visual Progress Track */}
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5B6FF6] to-[#7C5CFF] shadow-[0_0_15px_rgba(91,111,246,0.3)] transition-all duration-300"
                        style={{ width: `${(skills[i] / 10) * 100}%` }}
                      />
                      {/* Interactive Range (Invisible) */}
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={skills[i]} 
                        onChange={(e) => updateSkill(i, parseInt(e.target.value))} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-10 border-t border-white/10">
              {/* CGPA */}
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">CGPA</label>
                <input 
                  type="number" step="0.1" min="0" max="10"
                  value={cgpa} onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)} 
                  className="bg-white/5 border border-white/10 p-3 rounded-xl text-white font-medium focus:ring-2 focus:ring-[#5B6FF6]/50 transition-all outline-none" 
                />
              </div>

              {/* Projects */}
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Projects</label>
                <input 
                  type="number" min="0"
                  value={projects} onChange={(e) => setProjects(parseInt(e.target.value) || 0)} 
                  className="bg-white/5 border border-white/10 p-3 rounded-xl text-white font-medium focus:ring-2 focus:ring-[#5B6FF6]/50 transition-all outline-none" 
                />
              </div>

              {/* Internships */}
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Internships</label>
                <input 
                  type="number" min="0"
                  value={internships} onChange={(e) => setInternships(parseInt(e.target.value) || 0)} 
                  className="bg-white/5 border border-white/10 p-3 rounded-xl text-white font-medium focus:ring-2 focus:ring-[#5B6FF6]/50 transition-all outline-none" 
                />
              </div>

              {/* Role Dropdown */}
              <div className="flex flex-col space-y-2 relative">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Role</label>
                <button 
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  onBlur={() => setTimeout(() => setRoleDropdownOpen(false), 200)}
                  className="bg-white/5 border border-white/10 p-3 rounded-xl text-white font-medium text-left flex justify-between items-center hover:bg-white/10 transition-all focus:ring-2 focus:ring-[#5B6FF6]/50"
                >
                  <span className="truncate">{role}</span>
                  <motion.svg 
                    animate={{ rotate: roleDropdownOpen ? 180 : 0 }}
                    className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {roleDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-2 left-0 w-full bg-[#0F172A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
                    >
                      {availableRoles.map((r) => (
                        <button
                          key={r}
                          onClick={() => { setRole(r); setRoleDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#5B6FF6]/20 ${role === r ? 'text-[#5B6FF6] bg-[#5B6FF6]/10 font-bold' : 'text-[#94A3B8]'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tier Dropdown */}
              <div className="flex flex-col space-y-2 relative">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Tier</label>
                <button 
                  onClick={() => setTierDropdownOpen(!tierDropdownOpen)}
                  onBlur={() => setTimeout(() => setTierDropdownOpen(false), 200)}
                  className="bg-white/5 border border-white/10 p-3 rounded-xl text-white font-medium text-left flex justify-between items-center hover:bg-white/10 transition-all focus:ring-2 focus:ring-[#5B6FF6]/50"
                >
                  <span>{tier}</span>
                  <motion.svg 
                    animate={{ rotate: tierDropdownOpen ? 180 : 0 }}
                    className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {tierDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-2 left-0 w-full bg-[#0F172A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
                    >
                      {["Startup", "MNC", "TopTier"].map((t) => (
                        <button
                          key={t}
                          onClick={() => { setTier(t); setTierDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#5B6FF6]/20 ${tier === t ? 'text-[#5B6FF6] bg-[#5B6FF6]/10 font-bold' : 'text-[#94A3B8]'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm font-bold animate-pulse">
                {error}
                {!session && (
                  <button onClick={() => signIn("google")} className="ml-4 underline hover:text-white transition-colors">
                    Sign In Now
                  </button>
                )}
              </div>
            )}

            <button onClick={calculate} className="w-full bg-[#5B6FF6] hover:bg-[#7C5CFF] text-white font-bold py-4 rounded-2xl transition-all uppercase tracking-wider text-xs">Analyze My Market Standing</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Top Hero Badges */}
              <div className="flex flex-wrap justify-center gap-4">
                {/* Market Position Badge */}
                <div className="bg-[#0F172A] border border-[#5B6FF6]/30 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(91,111,246,0.2)] animate-bounce-subtle">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    Market Standing: <span className="text-[#21D4BD]">Top {100 - (marketPercentile || 50)}%</span>
                  </span>
                </div>

                {/* Data Confidence Badge */}
                <div className="bg-[#0F172A] border border-white/10 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                  <div className={`w-2.5 h-2.5 rounded-full ${confidenceLevel === 'High' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]' : confidenceLevel === 'Moderate' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]'}`} />
                  <span className="text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em]">Confidence: <span className="text-white">{confidenceLevel}</span></span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight uppercase">2. Intelligence Report</h1>
                <p className="text-sm text-[#94A3B8] opacity-60">Your profile has been processed against current market saturation indices.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Metric Cards */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(91,111,246,0.1)] transition-all group">
                <p className="text-sm font-medium text-[#94A3B8] uppercase tracking-widest mb-2">Readiness</p>
                <h3 className="text-4xl font-bold text-white group-hover:text-[#5B6FF6] transition-colors">{readiness}%</h3>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${readiness}%` }} className="h-full bg-[#5B6FF6]" />
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] transition-all group">
                <p className="text-sm font-medium text-[#94A3B8] uppercase tracking-widest mb-2">Market Tension</p>
                <h3 className="text-4xl font-bold text-white group-hover:text-red-400 transition-colors">{competition}%</h3>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${competition}%` }} className="h-full bg-red-500" />
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(33,212,189,0.1)] transition-all group">
                <p className="text-sm font-medium text-[#94A3B8] uppercase tracking-widest mb-2">Acceptance Odds</p>
                <h3 className="text-4xl font-bold text-[#21D4BD]">{probability}%</h3>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${probability}%` }} className="h-full bg-[#21D4BD]" />
                </div>
              </div>
            </div>

            {/* TOP MATCHES SECTION */}
            {topMatches.length > 0 && (
              <div className="space-y-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Top Curated Matches</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>
                  
                  {topMatches.length > itemsPerPage && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setMatchPage(p => Math.max(1, p - 1))}
                        disabled={matchPage === 1}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all hover:bg-white/10"
                      >
                        ←
                      </button>
                      <span className="text-[10px] font-black text-white px-2">
                        {matchPage} / {Math.ceil(topMatches.length / itemsPerPage)}
                      </span>
                      <button 
                        onClick={() => setMatchPage(p => Math.min(Math.ceil(topMatches.length / itemsPerPage), p + 1))}
                        disabled={matchPage === Math.ceil(topMatches.length / itemsPerPage)}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all hover:bg-white/10"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                  {topMatches.slice((matchPage - 1) * itemsPerPage, matchPage * itemsPerPage).map((match, i) => (
                    <div key={i} className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)]">
                      <MatchCard match={match} onView={setSelectedInternship} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-[10px]">Back to Profile</button>
              <button onClick={exportReport} className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold py-4 rounded-2xl border border-green-500/30 transition-all uppercase tracking-widest text-[10px]">Export PDF</button>
              <button onClick={() => setStep(3)} className="flex-[2] bg-gradient-to-r from-[#5B6FF6] to-[#7C5CFF] text-white font-bold py-4 rounded-2xl shadow-[0_0_25px_rgba(91,111,246,0.2)] transition-all uppercase tracking-widest text-xs">Simulate Growth Strategy</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight uppercase">3. ROI Strategy</h1>
                <p className="text-sm text-[#94A3B8] opacity-60">Strategize your learning. See how skill jumps impact your odds.</p>
              </div>
              <div className={`px-6 py-4 rounded-2xl border transition-all ${delta >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="text-sm font-semibold uppercase text-[#94A3B8] mb-1 text-center">New Odds</div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-white">{simulatedProbability}%</span>
                  <span className={`text-xs font-bold bg-white/10 px-2 py-0.5 rounded-lg ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>{delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {skillNames.map((name, i) => (
                <div key={name} className="bg-white/5 p-5 rounded-3xl border border-white/10 hover:border-[#21D4BD]/30 transition-all group/roi shadow-lg flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-[#94A3B8] group-hover/roi:text-[#21D4BD] transition-colors uppercase tracking-[0.15em]">{name}</span>
                    <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{simulatedSkills[i]}</span>
                  </div>
                  
                  <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    {/* Visual Progress Track */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#21D4BD] shadow-[0_0_10px_rgba(33,212,189,0.3)] transition-all duration-300"
                      style={{ width: `${(simulatedSkills[i] / 10) * 100}%` }}
                    />
                    {/* Interactive Range (Invisible) */}
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={simulatedSkills[i]} 
                      onChange={(e) => simulateSkillChange(i, parseInt(e.target.value))} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* SIMULATED TOP MATCHES SECTION */}
            {simulatedTopMatches.length > 0 && (
              <div className="space-y-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Growth Projections</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  {simulatedTopMatches.length > itemsPerPage && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSimMatchPage(p => Math.max(1, p - 1))}
                        disabled={simMatchPage === 1}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all hover:bg-white/10"
                      >
                        ←
                      </button>
                      <span className="text-[10px] font-black text-white px-2">
                        {simMatchPage} / {Math.ceil(simulatedTopMatches.length / itemsPerPage)}
                      </span>
                      <button 
                        onClick={() => setSimMatchPage(p => Math.min(Math.ceil(simulatedTopMatches.length / itemsPerPage), p + 1))}
                        disabled={simMatchPage === Math.ceil(simulatedTopMatches.length / itemsPerPage)}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all hover:bg-white/10"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                  {simulatedTopMatches.slice((simMatchPage - 1) * itemsPerPage, simMatchPage * itemsPerPage).map((match, i) => (
                    <div key={i} className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)]">
                      <MatchCard key={i} match={match} type="simulated" onView={setSelectedInternship} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-black/30 rounded-3xl border border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[#5B6FF6]/20 flex items-center justify-center text-[#5B6FF6] font-bold italic text-xl">i</div>
              <p className="text-sm text-[#94A3B8]/80 leading-relaxed italic">Strategic Insight: Improving a major skill from level 5 to 7 typically yields a 12-18% boost in acceptance probability for Top Tier companies.</p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-[10px]">Back to Intelligence Report</button>
              <button onClick={() => window.location.href = '/market-insights'} className="flex-[2] bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white font-bold py-4 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all uppercase tracking-widest text-xs">Explore Global Market Insights</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInternship && (
          <DetailModal 
            match={selectedInternship} 
            onClose={() => setSelectedInternship(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
