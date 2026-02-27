"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import Loader from "@/components/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function MarketInsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/market")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader message="Synthesizing Market Intelligence..." />
    </div>
  );

  if (!data) return <div className="text-center py-20">No market data available.</div>;

  const categoryChartData = {
    labels: data.topCategories.map((c: any) => c.category),
    datasets: [{
      label: 'Internships',
      data: data.topCategories.map((c: any) => c.count),
      backgroundColor: [
        'rgba(91, 111, 246, 0.7)',
        'rgba(33, 212, 189, 0.7)',
        'rgba(124, 92, 255, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(34, 197, 94, 0.7)',
      ],
      borderWidth: 0,
    }]
  };

  const stipendChartData = {
    labels: data.avgStipendCategory.map((c: any) => c.category),
    datasets: [{
      label: 'Avg Stipend (₹)',
      data: data.avgStipendCategory.map((c: any) => c.avgStipend),
      backgroundColor: '#5B6FF6',
      borderRadius: 12,
    }]
  };

  const skillChartData = {
    labels: data.topSkills.map((s: any) => s.skill),
    datasets: [{
      label: 'Job Postings',
      data: data.topSkills.map((s: any) => s.count),
      backgroundColor: '#21D4BD',
      borderRadius: 8,
    }]
  };

  const remoteChartData = {
    labels: ['Remote', 'Onsite/Hybrid'],
    datasets: [{
      data: [data.remoteRatio, data.onsiteRatio],
      backgroundColor: ['#21D4BD', 'rgba(255,255,255,0.05)'],
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { size: 14, weight: 'bold' as const },
        padding: 12,
        cornerRadius: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } },
      x: { grid: { display: false }, ticks: { color: '#94A3B8' } }
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-[#21D4BD] selection:text-black pt-12 pb-24">
      <div className="mesh-bg" />
      
      <div className="max-w-7xl mx-auto px-4">
        <header className="max-w-5xl mx-auto mb-16 text-center relative">
          <div className="inline-block bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-[#21D4BD] uppercase tracking-widest mb-6 backdrop-blur-md">
            Real-time Data Analytics
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
            Market <span className="text-[#5B6FF6]">Intelligence</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto font-medium opacity-80">
            Real-time interactive visualization of technical internship demand and financial benchmarks.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Category Distribution (Pie) */}
          <div className="lg:col-span-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-8">Role Category Distribution</h3>
            <div className="h-[300px]">
              <Pie data={categoryChartData} options={{ ...chartOptions, scales: undefined }} />
            </div>
          </div>

          {/* Stipend Benchmarks (Bar) */}
          <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-8">Monthly Stipend Benchmarks (₹)</h3>
            <div className="h-[300px]">
              <Bar data={stipendChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Top Skills Demand (Horizontal Bar style logic) */}
          <div className="lg:col-span-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-8">Skill Demand Intensity (Global Postings)</h3>
            <div className="h-[400px]">
              <Bar 
                data={skillChartData} 
                options={{ 
                  ...chartOptions, 
                  indexAxis: 'y' as const,
                }} 
              />
            </div>
          </div>

          {/* Remote Ratio (Doughnut) */}
          <div className="lg:col-span-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center text-center">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-8">Work Culture Ratio</h3>
            <div className="h-[250px] relative mb-6">
              <Doughnut data={remoteChartData} options={{ ...chartOptions, cutout: '80%', scales: undefined }} />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-[#21D4BD]">{data.remoteRatio}%</span>
                <span className="text-[10px] font-bold text-muted uppercase">Remote</span>
              </div>
            </div>
            <p className="text-sm text-muted opacity-60 leading-relaxed italic">Remote roles are currently experiencing 2.4x higher applicant pressure than onsite equivalents.</p>
          </div>
        </div>

        {/* Global Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Analyzed Postings", value: data.totalInternships, color: "text-white" },
            { label: "Active Categories", value: data.topCategories.length, color: "text-[#5B6FF6]" },
            { label: "Unique Skills", value: "140+", color: "text-[#21D4BD]" },
            { label: "Market Volatility", value: "Low", color: "text-green-400" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/[0.07] transition-all">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1">{stat.label}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
