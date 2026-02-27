import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic"

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const page = parseInt(searchParams.page || "1");
  const pageSize = 6;
  const skip = (page - 1) * pageSize;

  const [simulations, totalRuns] = await Promise.all([
    prisma.simulation.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.simulation.count({
      where: { userId: (session.user as any).id },
    }),
  ]);

  const allSimulations = await prisma.simulation.findMany({
    where: { userId: (session.user as any).id },
    select: { readiness: true, acceptanceProbability: true }
  });

  const avgReadiness = totalRuns > 0 
    ? Math.round(allSimulations.reduce((acc, s) => acc + s.readiness, 0) / totalRuns) 
    : 0;
  const maxProbability = totalRuns > 0 
    ? Math.max(...allSimulations.map(s => s.acceptanceProbability)) 
    : 0;

  const totalPages = Math.ceil(totalRuns / pageSize);

  return (
    <div className="relative min-h-screen selection:bg-[#21D4BD] selection:text-black pt-12 pb-24">
      <div className="mesh-bg" />
      
      <div className="max-w-5xl mx-auto px-4">
        <header className="max-w-5xl mx-auto mb-16 text-center relative">
          <div className="inline-block bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-[#21D4BD] uppercase tracking-widest mb-6 backdrop-blur-md">
            Personal Career Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
            Simulation <span className="text-[#5B6FF6]">History</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto font-medium opacity-80">
            Review your past market intelligence runs and strategic projections.
          </p>
        </header>

        {totalRuns > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block mb-1">Total Analysis Runs</span>
              <p className="text-3xl font-bold text-white">{totalRuns}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block mb-1">Avg. Market Readiness</span>
              <p className="text-3xl font-bold text-[#5B6FF6]">{avgReadiness}%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block mb-1">Peak Acceptance Odds</span>
              <p className="text-3xl font-bold text-[#21D4BD]">{maxProbability}%</p>
            </div>
          </div>
        )}

        {totalRuns === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-20 text-center">
            <p className="text-muted text-lg font-medium mb-8">You haven't run any simulations yet.</p>
            <Link href="/" className="btn-primary">
              Start Your First Simulation
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6">
              {simulations.map((sim) => (
                <div 
                  key={sim.id}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 transition-all hover:bg-white/[0.06] hover:border-[#5B6FF6]/30 group"
                >
                  <div className="flex flex-col gap-1 w-full md:w-auto">
                    <time className="text-[10px] font-bold text-[#21D4BD] uppercase tracking-widest">
                      {new Date(sim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#5B6FF6] transition-colors">{sim.role}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-[#94A3B8] uppercase">{sim.tier}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${sim.acceptanceProbability > 70 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        {sim.acceptanceProbability > 70 ? 'High Chance' : 'Competitive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-8 w-full md:w-auto justify-between md:justify-end pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Readiness</span>
                      <span className="text-xl font-bold text-white">{sim.readiness}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Competition</span>
                      <span className="text-xl font-bold text-red-400">{sim.competitionIndex}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Acceptance</span>
                      <span className="text-xl font-bold text-[#21D4BD]">{sim.acceptanceProbability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12 pt-10 border-t border-white/5">
                <Link
                  href={`/dashboard?page=${Math.max(1, page - 1)}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all ${
                    page <= 1 ? "opacity-30 pointer-events-none" : "hover:bg-white/5 hover:border-[#5B6FF6]/50 text-white"
                  }`}
                >
                  <span className="text-sm">←</span> Prev
                </Link>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                  {[...Array(totalPages)].map((_, i) => (
                    <Link
                      key={i}
                      href={`/dashboard?page=${i + 1}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                        page === i + 1
                          ? "bg-[#5B6FF6] text-white shadow-[0_0_20px_rgba(91,111,246,0.4)]"
                          : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/dashboard?page=${Math.min(totalPages, page + 1)}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all ${
                    page >= totalPages ? "opacity-30 pointer-events-none" : "hover:bg-white/5 hover:border-[#5B6FF6]/50 text-white"
                  }`}
                >
                  Next <span className="text-sm">→</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
