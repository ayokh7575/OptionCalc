export default function InputField({ label, value, onChange, prefix = '', placeholder = '0.00', hint, type = 'number', uppercase = false }) {
  const handleChange = e => {
    const val = uppercase ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') : e.target.value
    onChange(val)
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{prefix}</span>
        )}
        <input
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          step={type === 'number' ? 'any' : undefined}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full bg-slate-800 border border-slate-600 rounded-lg py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${prefix ? 'pl-7 pr-3' : 'px-3'}`}
        />
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
