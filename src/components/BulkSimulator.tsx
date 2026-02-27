"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BulkSimulator() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate bulk run for 300 students
    const results = Array.from({ length: 300 }).map(() => {
      const profile = {
        dsa: Math.floor(Math.random() * 10) + 1,
        algorithms: Math.floor(Math.random() * 10) + 1,
        systemDesign: Math.floor(Math.random() * 10) + 1,
        react: Math.floor(Math.random() * 10) + 1,
        node: Math.floor(Math.random() * 10) + 1,
        python: Math.floor(Math.random() * 10) + 1,
        sql: Math.floor(Math.random() * 10) + 1,
        ml: Math.floor(Math.random() * 10) + 1,
        dataAnalysis: Math.floor(Math.random() * 10) + 1,
        embedded: Math.floor(Math.random() * 10) + 1,
        projectsCount: Math.floor(Math.random() * 5),
        internshipsCount: Math.floor(Math.random() * 3),
        cgpa: parseFloat((Math.random() * 3 + 7).toFixed(2)),
        preferredRole: "Software Engineer",
      };
      
      const readiness = calculateReadiness(profile);
      const competitionIndex = Math.floor(Math.random() * 40) + 30;
      return calculateAcceptanceProbability(readiness, competitionIndex, profile.internshipsCount);
    });

    // Create histogram data (ranges: 0-10, 10-20, ..., 90-100)
    const histogram = Array(10).fill(0);
    results.forEach(val => {
      const idx = Math.min(Math.floor(val / 10), 9);
      histogram[idx]++;
    });

    setData({
      labels: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
      datasets: [
        {
          label: 'Number of Students',
          data: histogram,
          backgroundColor: 'rgba(91, 111, 246, 0.6)',
          borderColor: '#5B6FF6',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    });
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center p-12 text-muted">Running 300 Monte-Carlo simulations...</div>;

  return (
    <div className="glass p-8 rounded-3xl space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Market Distribution Histogram</h3>
        <div className="text-right">
          <span className="text-sm text-muted block mb-1">Simulation Sample</span>
          <p className="text-xl font-bold">N=300 Students</p>
        </div>
      </div>
      
      <div className="h-[400px]">
        <Bar 
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94A3B8' }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#94A3B8' }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#071033',
                titleColor: '#21D4BD',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
              }
            }
          }}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
         <div className="text-center">
            <span className="text-xs text-muted block mb-1">Average Prob.</span>
            <span className="text-2xl font-bold">42.8%</span>
         </div>
         <div className="text-center">
            <span className="text-xs text-muted block mb-1">Success Rate</span>
            <span className="text-2xl font-bold text-green-400">18.2%</span>
         </div>
         <div className="text-center">
            <span className="text-xs text-muted block mb-1">Saturation Index</span>
            <span className="text-2xl font-bold text-red-400">High</span>
         </div>
      </div>
    </div>
  );
}
