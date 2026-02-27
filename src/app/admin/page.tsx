import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Strict Admin Role Check
  if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-4">
        <div className="mesh-bg" />
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-16 text-center max-w-lg shadow-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-400 text-4xl mx-auto mb-8 font-black italic shadow-inner">!</div>
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Access Restricted</h1>
          <p className="text-muted font-medium mb-8">This module is reserved for platform administrators only. If you believe this is an error, please contact technical support.</p>
          <Link href="/" className="btn-primary inline-block">Return to Dashboard</Link>
        </div>
      </div>
    )
  }

  const events = await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  })

  const totalUsers = await prisma.user.count()
  const totalSimulations = await prisma.simulation.count()
  const totalEvents = await prisma.analyticsEvent.count()

  // Bonus Metrics
  const popularRoles = await prisma.simulation.groupBy({
    by: ['role'],
    _count: {
      role: true,
    },
    orderBy: {
      _count: {
        role: 'desc',
      },
    },
    take: 3,
  });

  return (
    <div className="relative min-h-screen selection:bg-[#21D4BD] selection:text-black pt-12 pb-24">
      <div className="mesh-bg" />
      
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase tracking-tighter">
            Platform <span className="text-[#21D4BD]">Analytics</span>
          </h1>
          <p className="text-muted text-base mt-2 font-medium opacity-60">
            Real-time engagement metrics and event intelligence.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Users", value: totalUsers, color: "text-white" },
            { label: "Total Simulations", value: totalSimulations, color: "text-[#5B6FF6]" },
            { label: "Total Events Logged", value: totalEvents, color: "text-[#21D4BD]" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all">
              <span className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">{stat.label}</span>
              <span className={`text-4xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Recent Activity Log</h2>
            <div className="space-y-3">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/10 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-[#21D4BD] uppercase tracking-widest">{event.eventType}</span>
                    <span className="text-sm text-white/80 font-bold">{event.user?.name || event.user?.email || "Anonymous User"}</span>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <span className="text-[10px] text-muted font-black uppercase tracking-widest">{new Date(event.createdAt).toLocaleTimeString()}</span>
                    <span className="text-[10px] text-muted opacity-40 font-bold">{new Date(event.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intelligence Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Trending Roles</h3>
              <div className="space-y-4">
                {popularRoles.map((role, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-sm text-muted font-bold">{role.role}</span>
                    <span className="text-sm font-black text-white">{role._count.role} runs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5B6FF6]/10 to-transparent border border-[#5B6FF6]/20 rounded-3xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Strategic Note</h3>
              <p className="text-sm text-muted leading-relaxed font-medium">
                Most students are currently simulating SDE roles. Increasing target role diversity could improve platform niche positioning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
