import { NextResponse } from "next/server"

export async function GET() {
  // We'll return a curated, high-level list of common roles
  // that students actually recognize, while keeping them mapped to our data categories.
  const commonRoles = [
    "Software Engineer (General)",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile App Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Researcher",
    "UI/UX Designer",
    "Product Manager",
    "Blockchain Developer",
    "Cybersecurity Analyst",
    "Cloud Engineer (DevOps)",
    "QA / Testing Engineer"
  ].sort((a, b) => a.localeCompare(b));

  return NextResponse.json({ roles: commonRoles })
}
