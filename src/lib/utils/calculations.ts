export const calculateReadiness = (profile: any) => {
  // Readiness = 0.40*SkillAvg + 0.20*ProjectStrength + 0.20*ExperienceFactor + 0.10*CGPA_normalized + 0.10*RoleMatch
  
  const skills = [
    profile.dsa, profile.algorithms, profile.systemDesign, profile.react, profile.node,
    profile.python, profile.sql, profile.ml, profile.dataAnalysis, profile.embedded
  ];
  const skillAvg = skills.reduce((a, b) => a + b, 0) / skills.length;
  
  // Normalize ProjectStrength (assume max 10 projects for 100 score, or just use count * 10 capped at 100?)
  // Prompt says "ProjectStrength". Let's assume input is raw count.
  // We can normalize it: 5 projects = 100.
  const projectStrength = Math.min(profile.projectsCount * 20, 100);
  
  // ExperienceFactor: Internships. 2 internships = 100.
  const experienceFactor = Math.min(profile.internshipsCount * 50, 100);
  
  // CGPA_normalized: Input is 0-10.
  const cgpaNormalized = profile.cgpa * 10;
  
  // RoleMatch: Hard to calculate without target role.
  // The prompt says "RoleMatch" in the formula.
  // In the simulator, we might not have a target company yet, or we assume generic match.
  // Let's assume a default high match if not specified, or based on preferredRole.
  // For now, let's value it at 80 (Good match) if not provided.
  const roleMatch = 80; 

  const readiness = (0.40 * skillAvg * 10) + (0.20 * projectStrength) + (0.20 * experienceFactor) + (0.10 * cgpaNormalized) + (0.10 * roleMatch);
  return Math.min(Math.max(readiness, 0), 100);
};

export const calculateAcceptanceProbability = (readiness: number, competitionIndex: number, experienceFactorRaw: number = 0, roleMatch: number = 80) => {
  // AcceptanceProbability = clamp(Readiness*0.50 - CompetitionIndex*0.30 + ExperienceFactor*0.10 + RoleMatch*0.10, 0,100)
  
  // Note: experienceFactorRaw here should probably be the normalized score (0-100) or similar. 
  // The formula usually implies normalized inputs.
  const experienceFactor = Math.min(experienceFactorRaw * 50, 100);
  
  const probability = (readiness * 0.50) - (competitionIndex * 0.30) + (experienceFactor * 0.10) + (roleMatch * 0.10);
  return Math.min(Math.max(probability, 0), 100);
};

export const calculateGrowthIndex = (offer: any) => {
  // GrowthIndex = 0.40*LearningScore + 0.30*BrandScore + 0.20*TechStackValue + 0.10*NetworkScore
  // Scores are 1-10. Result will be 1-10.
  const index = (0.40 * offer.learningScore) + (0.30 * offer.brandScore) + (0.20 * offer.techStackValue) + (0.10 * offer.networkScore);
  return index;
};
