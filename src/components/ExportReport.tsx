"use client";
import { jsPDF } from "jspdf";

interface ExportReportProps {
  results: any;
  profile: any;
}

export default function ExportReport({ results, profile }: ExportReportProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text("InternScope Market Intelligence Report", 20, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Profile Section
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Candidate Profile", 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Target Role: ${profile.preferredRole}`, 20, 55);
    doc.text(`CGPA: ${profile.cgpa}`, 20, 65);
    doc.text(`Projects: ${profile.projectsCount}`, 100, 65);
    doc.text(`Internships: ${profile.internshipsCount}`, 20, 75);
    
    // Skills
    doc.text("Top Skills:", 20, 90);
    let y = 100;
    Object.keys(profile).forEach((key) => {
        if (['dsa', 'react', 'python', 'node', 'systemDesign'].includes(key)) {
            doc.text(`- ${key}: ${profile[key]}/10`, 30, y);
            y += 7;
        }
    });

    // Simulation Results
    doc.setDrawColor(200);
    doc.line(20, y + 5, 190, y + 5);
    
    y += 20;
    doc.setFontSize(16);
    doc.text("Simulation Results", 20, y);
    
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0); // Green
    doc.text(`Market Readiness: ${results.readiness.toFixed(1)}%`, 20, y);
    
    y += 10;
    doc.setTextColor(200, 0, 0); // Red
    doc.text(`Competition Index: ${results.compIndex}/100`, 20, y);
    
    y += 10;
    doc.setTextColor(0, 0, 200); // Blue
    doc.text(`Acceptance Probability: ${results.acceptance.toFixed(1)}%`, 20, y);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Powered by InternScope Decision Engine", 20, 280);
    
    doc.save("InternScope_Report.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export Analysis PDF
    </button>
  );
}
