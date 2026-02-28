import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const INDIAN_CITIES = [
  "Bangalore", "Bengaluru", "Mumbai", "Pune", "Hyderabad", "Delhi", "Chennai", 
  "Gurgaon", "Gurugram", "Noida", "Ahmedabad", "Kolkata", "Indore", "Jaipur", 
  "Lucknow", "Chandigarh", "Visakhapatnam", "Nagpur", "Kochi", "Coimbatore",
  "Thane", "Bhopal", "Navi Mumbai"
];

const JUNK_KEYWORDS = [
  "actively hiring", "hiring", "work from home", "remote", "onsite", "hybrid",
  "english proficiency", "spoken", "written", "part time", "full time", "lpa", "post internship",
  "early applicant"
];

const MISPLACED_SKILLS = [
  "English Proficiency (Written)",
  "Product Lifecycle Management(PLM)",
  "Database Management System (DBMS)",
  "Search Engine Optimization (SEO)",
  "Software Development Life Cycle (SDLC)",
  "Internet of Things (IoT)",
  "Amazon Web Services (AWS)",
  "Quality Assurance/Quality Control (QA/QC)",
  "Object Oriented Programming (OOP)",
  "Machine Learning Operations (MLOps)",
  "Artificial Intelligence Markup Language (AIML)",
  "User Interface (UI) Development"
];

function cleanString(str: string | null | undefined) {
  if (!str) return "";
  return str.trim();
}

function deepClean(rawData: any[]) {
  return rawData.map(item => {
    let company = cleanString(item.company);
    let role = cleanString(item.role);
    let location = cleanString(item.location);
    let skills = Array.isArray(item.skills) ? [...item.skills] : [];

    // 1. Fix 'days ago' in location
    if (location.toLowerCase().includes("ago")) {
      location = "Remote";
    }

    // 2. Fix User Identified Misplaced Skills in Location
    const foundMisplacedSkill = MISPLACED_SKILLS.find(s => location.toLowerCase().includes(s.toLowerCase()));
    if (foundMisplacedSkill) {
      if (!skills.includes(foundMisplacedSkill)) {
        skills.push(foundMisplacedSkill);
      }
      location = "Remote";
    }

    // 3. Fix Swapped Fields
    const roleHeuristics = ["development", "developer", "analyst", "engineer", "designer", "scientist", "manager", "tester"];
    if (roleHeuristics.some(h => company.toLowerCase().includes(h)) && 
        (role.toLowerCase().includes("part time") || role.toLowerCase().includes("hiring") || role.toLowerCase().includes("early applicant"))) {
      const temp = company;
      company = "Unknown Company";
      role = temp;
    }

    // 4. Role Recovery (If generic, look in skills)
    if (role.toLowerCase().includes("hiring") || role.toLowerCase().includes("job offer") || role.toLowerCase().includes("part time")) {
      const skillRole = skills.find((s: any) => typeof s === 'string' && roleHeuristics.some(h => s.toLowerCase().includes(h)));
      if (skillRole) role = skillRole;
    }

    // 5. Categorization Logic (Expanded to check skills)
    const r = role.toLowerCase();
    const sAll = skills.join(" ").toLowerCase();
    let category = "Other";

    if (r.includes("android") || r.includes("flutter") || r.includes("ios") || sAll.includes("android") || sAll.includes("flutter")) 
      category = "Mobile Development";
    else if (r.includes("python") || r.includes("backend") || r.includes("node") || r.includes("java") || sAll.includes("node") || sAll.includes("express")) 
      category = "Backend Development";
    else if (r.includes("data") || r.includes("ml") || r.includes("ai") || sAll.includes("data analyst") || sAll.includes("machine learning")) 
      category = "Data & AI";
    else if (r.includes("frontend") || r.includes("react") || r.includes("web") || r.includes("ui") || sAll.includes("react") || sAll.includes("javascript")) 
      category = "Frontend & UI/UX";
    else if (r.includes("full stack") || r.includes("mern") || sAll.includes("mern") || sAll.includes("full stack")) 
      category = "Full Stack";
    else if (r.includes("blockchain") || r.includes("web3") || sAll.includes("solidity") || sAll.includes("ethereum")) 
      category = "Blockchain";
    else if (r.includes("product") || r.includes("management") || sAll.includes("product manager")) 
      category = "Product";

    // 6. Merge Category and Role into Role field
    // wherever there is "actively hiring" or generic role, use category
    if (role.toLowerCase().includes("actively hiring") || role.toLowerCase().includes("early applicant")) {
      role = category;
    } else {
      // Avoid merging if category is already basically the role
      if (!role.toLowerCase().includes(category.toLowerCase().split(' ')[0])) {
        role = `${category}: ${role}`;
      }
    }

    // 7. Fix Location (Description in Location)
    if (location.length > 50 || location.includes("1.") || location.includes("http")) {
      const foundCity = skills.find((s: any) => typeof s === 'string' && INDIAN_CITIES.some(c => s.toLowerCase().includes(c.toLowerCase())));
      location = foundCity || "Remote";
    }
    
    if (!location || location === "null" || location === "Unknown") {
       const foundCity = skills.find((s: any) => typeof s === 'string' && INDIAN_CITIES.some(c => s.toLowerCase().includes(c.toLowerCase())));
       location = foundCity || "Remote";
    }

    // 8. Normalize Stipend
    let sMin = parseInt(item.stipendMin) || 0;
    let sMax = parseInt(item.stipendMax) || 0;
    if (sMax < 100 && sMax > 0) { 
       sMin = Math.round((sMin * 100000) / 12);
       sMax = Math.round((sMax * 100000) / 12);
    }

    // 9. Clean Skills
    const companyLower = company.toLowerCase();
    const locationLower = location.toLowerCase();
    const roleLower = role.toLowerCase();

    const cleanedSkills = skills.filter((s: any) => {
      if (!s || typeof s !== 'string') return false;
      const sl = s.toLowerCase();
      const isJunk = JUNK_KEYWORDS.some(j => sl.includes(j));
      const isCompany = sl.includes(companyLower) || (companyLower && companyLower.includes(sl));
      const isLocation = sl.includes(locationLower.split(',')[0].trim());
      const isRole = sl === roleLower;
      return !isJunk && !isCompany && !isLocation && !isRole && s.length < 40;
    });

    return {
      id: item.id,
      company,
      role,
      category,
      location,
      remoteType: item.remoteType || "Onsite",
      stipendMin: sMin,
      stipendMax: sMax,
      durationMonths: item.durationMonths || 0,
      skills: Array.from(new Set(cleanedSkills)) as string[]
    };
  });
}

export async function seedInternships(data?: any[]) {
  console.log("🚀 Deep Cleaning & Merging Roles...");
  
  let rawData = data;
  if (!rawData) {
    const rawFilePath = path.join(process.cwd(), 'data', 'internships.json');
    if (fs.existsSync(rawFilePath)) {
      rawData = JSON.parse(fs.readFileSync(rawFilePath, 'utf8'));
    } else {
      // Fallback for when data/ is not found (like on some build envs)
      console.warn("internships.json not found, skipping internship seeding");
      return;
    }
  }

  if (!rawData) return;
  
  // Filter out rows where company name contains "+ (number) more"
  const filteredRawData = rawData.filter((item: any) => {
    const company = item.company || "";
    return !/\+\d+\s+more/i.test(company);
  });

  const cleanedData = deepClean(filteredRawData);

  await prisma.internship.deleteMany();
  await prisma.internship.createMany({ data: cleanedData });

  console.log("✅ Roles merged and data seeded successfully.");
}

// Only run if this is the main module
if (require.main === module) {
  seedInternships()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
}
