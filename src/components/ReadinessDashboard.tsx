"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SkillRadarChart from "./charts/SkillRadarChart";
import { calculateReadiness } from "@/lib/calculations/readiness";
import { getDefaultCompetitionIndex } from "@/lib/calculations/market";
import { calculateAcceptanceProbability } from "@/lib/calculations/probability";

interface ReadinessDashboardProps {
  profile: any;
}

export default function ReadinessDashboard({ profile }: ReadinessDashboardProps) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const skillKeys = ["dsa", "algorithms", "systemDesign", "react", "node", "python", "sql", "ml", "dataAnalysis", "embedded"];
  const readinessSkills = skillKeys.map(key => (profile[key] || 0) * 10);

  useEffect(() => {
    // 1. Calculate skillAvg
    const skillAvg = readinessSkills.reduce((a, b) => a + b, 0) / readinessSkills.length;

    // 2. Call calculation engine (direct call for responsiveness)
    const readiness = calculateReadiness({
      skillAvg,
      projects: profile.projectsCount,
      internships: profile.internshipsCount,
      cgpa: profile.cgpa,
      roleMatch: 80,
    });

    const compIndex = getDefaultCompetitionIndex();

    const acceptance = calculateAcceptanceProbability({
      readiness,
      competitionIndex: compIndex,
      experienceFactor: Math.min(profile.internshipsCount * 50, 100),
      roleMatch: 80,
    });

    setResults({ readiness, acceptance, compIndex, skillAvg });
    setLoading(false);
  }, [profile]);

  if (loading || !results) return <div className="p-12 text-center text-muted">Calculating Readiness...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5B6FF6] to-[#7C5CFF]">
            Market Readiness Analysis
          </h3>
          <p className="text-muted text-sm mt-1">Based on current industry standards and competitive indices.</p>
        </div>

        <div className="flex items-end gap-4">
          <div className="text-7xl font-black text-white">
            {results.readiness}%
          </div>
          <div className="pb-2">
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${results.readiness > 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {results.readiness > 70 ? 'Industry Ready' : 'Growth Needed'}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-muted">Skill Average Score</span>
            <span className="font-bold">{(results.skillAvg / 10).toFixed(1)} / 10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Acceptance Probability</span>
            <span className="font-bold text-[#21D4BD]">{results.acceptance.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Market Competition Index</span>
            <span className="font-bold text-red-400">{results.compIndex}%</span>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#5B6FF6] to-[#7C5CFF] hover:shadow-[0_0_20px_rgba(91,111,246,0.4)] text-white font-bold py-4 rounded-xl transition-all">
          Generate Detailed AI Feedback
        </button>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl">
        <h4 className="text-center text-sm font-bold text-muted mb-4 uppercase tracking-widest">Skill Radar</h4>
        <SkillRadarChart skills={readinessSkills} />
      </div>
    </div>
  );
}
