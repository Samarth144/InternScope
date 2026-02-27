"use client"

interface Props {
  value: number
}

export default function CompetitionMeter({ value }: Props) {
  const color =
    value > 80 ? "bg-red-500"
    : value > 60 ? "bg-orange-500"
    : "bg-green-500"

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-white">
        Market Competition Index
      </h2>

      <div className="w-full bg-white/10 h-6 rounded-full overflow-hidden border border-white/10">
        <div
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="text-sm font-bold text-muted uppercase tracking-tighter">
        {value}% Market Saturation (Difficulty: {value > 80 ? 'Extreme' : value > 60 ? 'High' : 'Moderate'})
      </p>
    </div>
  )
}
