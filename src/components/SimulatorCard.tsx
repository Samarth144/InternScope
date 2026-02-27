"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateReadiness } from "@/lib/calculations/readiness";
import { calculateAcceptanceProbability } from "@/lib/calculations/probability";
import { getDefaultCompetitionIndex } from "@/lib/calculations/market";
import ExportReport from "./ExportReport";
import styles from "./SimulatorCard.module.css";

interface SimulatorCardProps {
  profile: any;
}

export default function SimulatorCard({ profile: initialProfile }: SimulatorCardProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const skillKeys = ["dsa", "algorithms", "systemDesign", "react", "node", "python", "sql", "ml", "dataAnalysis", "embedded"];
    const skillAvg = (skillKeys.reduce((acc, key) => acc + (profile[key] || 0), 0) / skillKeys.length) * 10;
    
    const readiness = calculateReadiness({
      skillAvg,
      projects: profile.projectsCount,
      internships: profile.internshipsCount,
      cgpa: profile.cgpa,
      roleMatch: 80 // Default match
    });

    const compIndex = getDefaultCompetitionIndex(); // Centralized market competition
    
    const acceptance = calculateAcceptanceProbability({
      readiness,
      competitionIndex: compIndex,
      experienceFactor: Math.min(profile.internshipsCount * 50, 100),
      roleMatch: 80
    });
    
    setResults({ readiness, acceptance, compIndex });
  }, [profile]);

  const boostSkill = (skill: string) => {
    setProfile((prev: any) => ({ ...prev, [skill]: Math.min(prev[skill] + 1, 10) }));
  };

  if (!results) return null;

  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.scoreSection}>
          <div>
            <span className={styles.label}>Market Readiness Score</span>
            <div className={styles.scoreBig}>
              {results.readiness.toFixed(1)}%
            </div>
            <div className={styles.progressBarContainer}>
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${results.readiness}%` }}
                 className={styles.progressBar} 
               />
            </div>
          </div>

          <div className={styles.statsGrid}>
             <div className={styles.statItem}>
                <span className={styles.label}>Competition Index</span>
                <span className={`${styles.statValue} ${styles.statDanger}`}>{results.compIndex}%</span>
             </div>
             <div className={styles.statItem}>
                <span className={styles.label}>Acceptance Chance</span>
                <span className={`${styles.statValue} ${styles.statSuccess}`}>{results.acceptance.toFixed(1)}%</span>
             </div>
          </div>
        </div>

        <div className={styles.simulationSection}>
          <div>
            <h4 className={styles.title}>Live Simulation Engine</h4>
            <p className={styles.subtitle}>Adjust skills to see real-time impact on your acceptance probability.</p>
          </div>
          
          <div className={styles.skillList}>
            {["dsa", "systemDesign", "react", "python"].map((skill) => (
              <div key={skill} className={styles.skillItem}>
                <div className={styles.skillInfo}>
                  <span className={styles.skillName}>{skill}</span>
                  <span className={styles.skillLevel}>Level: {profile[skill]}</span>
                </div>
                <button 
                  onClick={() => boostSkill(skill)}
                  className={styles.boostBtn}
                >
                  What if +1?
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <ExportReport results={results} profile={profile} />
          </div>
        </div>
      </div>

      <div className={styles.algorithmBreakdown}>
        <span className={styles.label}>Algorithm Breakdown (Judges View)</span>
        <div className={styles.algoGrid}>
           <div className={styles.algoBox}>
             Readiness = 0.40*SkillAvg + 0.20*Projects + 0.20*Experience + 0.10*CGPA + 0.10*RoleMatch
           </div>
           <div className={styles.algoBox}>
             AcceptanceProbability = clamp(Readiness*0.50 - Competition*0.30 + Experience*0.10 + RoleMatch*0.10, 0,100)
           </div>
        </div>
      </div>
    </div>
  );
}
