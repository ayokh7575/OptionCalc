export default function Card({ title, children, accent }) {
  return (
    <div className={`bg-slate-800/50 rounded-xl border ${accent ? 'border-indigo-700/50' : 'border-slate-700/50'} p-4`}>
      {title && <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">{title}</h2>}
      {children}
    </div>
  )
}
