"use client"

import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface Props {
  skills: number[]
}

export default function SkillRadarChart({ skills }: Props) {
  const data = {
    labels: [
      "DSA", "Algorithms", "System Design", "React",
      "Node", "Python", "SQL", "ML",
      "Data Analysis", "Embedded"
    ],
    datasets: [
      {
        label: "Skill Strength",
        data: skills,
        backgroundColor: "rgba(33, 212, 189, 0.2)",
        borderColor: "#21D4BD",
        borderWidth: 2,
        pointBackgroundColor: "#5B6FF6",
      }
    ]
  }

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        pointLabels: {
          color: "#94A3B8",
          font: {
            size: 10
          }
        },
        ticks: {
          display: false,
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return <Radar data={data} options={options} />
}
