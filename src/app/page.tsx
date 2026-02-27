import LandingHero from "@/components/LandingHero"
import MarketSnapshot from "@/components/MarketSnapshot"
import ProblemSection from "@/components/ProblemSection"
import FeaturesSection from "@/components/FeaturesSection"
import HowItWorks from "@/components/HowItWorks"
import FinalCTA from "@/components/FinalCTA"

export default function Home() {
  return (
    <div className="relative selection:bg-[#21D4BD] selection:text-black">
      <LandingHero />
      <MarketSnapshot />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <FinalCTA />
      
      <footer className="max-w-5xl mx-auto py-12 border-t border-card-border text-center opacity-40">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">
          InternScope Professional Career Simulation Engine © 2026
        </p>
      </footer>
    </div>
  )
}
