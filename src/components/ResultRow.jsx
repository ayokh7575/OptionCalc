export default function ResultRow({ label, value, sub, badge, badgeColor, mono = true }) {
  const badgeColors = {
    green: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700',
    yellow: 'bg-amber-900/60 text-amber-400 border border-amber-700',
    red: 'bg-red-900/60 text-red-400 border border-red-700',
    blue: 'bg-indigo-900/60 text-indigo-400 border border-indigo-700',
  }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-700/50 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm text-slate-400">{label}</span>
        {sub && <span className="text-xs text-slate-500 mt-0.5">{sub}</span>}
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[badgeColor] || badgeColors.blue}`}>
            {badge}
          </span>
        )}
        <span className={`text-sm font-semibold text-white ${mono ? 'font-mono' : ''}`}>{value}</span>
      </div>
    </div>
  )
}
