import { useState } from 'react'
import InputField from '../components/InputField'
import Card from '../components/Card'
import { calcStrikeRow, fmtPct, fmtDollar, beColor } from '../utils/calculations'

const BADGE = {
  green: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700',
  yellow: 'bg-amber-900/60 text-amber-400 border border-amber-700',
  red: 'bg-red-900/60 text-red-400 border border-red-700',
}

const DEFAULT_ROWS = Array(8).fill(null).map(() => ({ strike: '', midpoint: '' }))

export default function StrikeTable() {
  const [currentPrice, setCurrentPrice] = useState('')
  const [rows, setRows] = useState(DEFAULT_ROWS)

  const updateRow = (i, key, val) => {
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row))
  }

  const addRow = () => setRows(r => [...r, { strike: '', midpoint: '' }])
  const removeRow = i => setRows(r => r.filter((_, idx) => idx !== i))

  const computed = rows.map(row =>
    row.strike && row.midpoint && currentPrice
      ? calcStrikeRow(currentPrice, row.strike, row.midpoint)
      : null
  )

  const hasAny = computed.some(c => c !== null)

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-xs text-slate-400">
        <strong className="text-slate-300">Mike Yuen Rule:</strong> Breakeven should be no more than 5% above current price (10% tops). Enter option midpoints from your broker.
      </div>

      <Card title="Current Price">
        <InputField
          label="Current Share Price"
          value={currentPrice}
          onChange={setCurrentPrice}
          prefix="$"
          placeholder="206.17"
        />
      </Card>

      <Card title="Strike Analysis">
        <div className="space-y-2 mb-3">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                {i === 0 && <label className="block text-xs text-slate-500 mb-1">Strike $</label>}
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={row.strike}
                  onChange={e => updateRow(i, 'strike', e.target.value)}
                  placeholder="175"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                {i === 0 && <label className="block text-xs text-slate-500 mb-1">Midpoint $</label>}
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={row.midpoint}
                  onChange={e => updateRow(i, 'midpoint', e.target.value)}
                  placeholder="73.95"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => removeRow(i)}
                className="mb-0 pb-2.5 text-slate-600 hover:text-red-400 text-lg leading-none"
              >×</button>
            </div>
          ))}
        </div>
        <button
          onClick={addRow}
          className="w-full py-2 text-sm text-indigo-400 border border-dashed border-indigo-700/50 rounded-lg hover:border-indigo-500 hover:text-indigo-300 transition-colors"
        >
          + Add Row
        </button>
      </Card>

      {hasAny && (
        <Card title="Results">
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="text-left py-2 pr-2">Strike</th>
                  <th className="text-right py-2 pr-2">% Below</th>
                  <th className="text-right py-2 pr-2">BE Price</th>
                  <th className="text-right py-2">BE % Above</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const c = computed[i]
                  if (!c) return null
                  const color = beColor(c.beAbovePct)
                  return (
                    <tr key={i} className="border-b border-slate-700/50 last:border-0">
                      <td className="py-2.5 pr-2 font-mono text-white">{fmtDollar(parseFloat(row.strike))}</td>
                      <td className="py-2.5 pr-2 text-right text-slate-400 font-mono">{fmtPct(c.pctBelow)}</td>
                      <td className="py-2.5 pr-2 text-right font-mono text-white">{fmtDollar(c.breakeven)}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${BADGE[color]}`}>
                          {fmtPct(c.beAbovePct)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 mt-3 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${BADGE.green}`}>≤ 5% ✓</span>
            <span className={`px-2 py-0.5 rounded-full ${BADGE.yellow}`}>5–10% !</span>
            <span className={`px-2 py-0.5 rounded-full ${BADGE.red}`}>&gt; 10% ✗</span>
          </div>
        </Card>
      )}
    </div>
  )
}
