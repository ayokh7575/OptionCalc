import { useState } from 'react'
import InputField from '../components/InputField'
import ResultRow from '../components/ResultRow'
import Card from '../components/Card'
import { calcLongCall, fmt, fmtPct, fmtDollar, beColor } from '../utils/calculations'

function StatusPill({ ok, warn, label }) {
  if (ok) return <span className="text-xs bg-emerald-900/60 text-emerald-400 border border-emerald-700 px-2 py-0.5 rounded-full">{label} ✓</span>
  if (warn) return <span className="text-xs bg-amber-900/60 text-amber-400 border border-amber-700 px-2 py-0.5 rounded-full">{label} !</span>
  return <span className="text-xs bg-red-900/60 text-red-400 border border-red-700 px-2 py-0.5 rounded-full">{label} ✗</span>
}

function IVBar({ ivPct }) {
  const pct = Math.min(Math.max(ivPct * 100, 0), 100)
  const isBalanced = pct >= 40 && pct <= 60
  const barColor = isBalanced ? 'bg-emerald-500' : pct > 80 ? 'bg-red-500' : 'bg-amber-500'
  return (
    <div className="mt-1">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>Intrinsic {fmtPct(ivPct)}</span>
        <span>Extrinsic {fmtPct(1 - ivPct)}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-1">
        {isBalanced ? '✓ Good 50/50 balance' : pct > 80 ? '⚠ Deep ITM — mostly intrinsic' : pct < 20 ? '⚠ Mostly time value (extrinsic)' : 'Target: 50/50 mix'}
      </p>
    </div>
  )
}

export default function LongCall() {
  const [fields, setFields] = useState({
    ticker: '',
    currentPrice: '',
    callPremium: '',
    strikePrice: '',
    contracts: '1',
    sharesPerContract: '100',
  })

  const set = key => val => setFields(f => ({ ...f, [key]: val }))

  const hasInputs = fields.currentPrice && fields.callPremium && fields.strikePrice
  const r = hasInputs ? calcLongCall(fields) : null

  const costOk = r && r.costRulePct <= 1 / 3
  const costWarn = r && r.costRulePct > 1 / 3 && r.costRulePct <= 0.5
  const beOk = r && r.beAbovePct <= 0.05
  const beWarn = r && r.beAbovePct > 0.05 && r.beAbovePct <= 0.10

  return (
    <div className="space-y-4">
      <Card title="Inputs">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <InputField
              label="Ticker Symbol"
              value={fields.ticker}
              onChange={set('ticker')}
              placeholder="e.g. DRI"
            />
          </div>
          <InputField label="Current Price" value={fields.currentPrice} onChange={set('currentPrice')} prefix="$" placeholder="206.17" />
          <InputField label="Strike Price" value={fields.strikePrice} onChange={set('strikePrice')} prefix="$" placeholder="175.00" />
          <InputField label="Call Premium" value={fields.callPremium} onChange={set('callPremium')} prefix="$" placeholder="37.50" />
          <InputField label="# of Contracts" value={fields.contracts} onChange={set('contracts')} placeholder="1" />
          <InputField label="Shares / Contract" value={fields.sharesPerContract} onChange={set('sharesPerContract')} placeholder="100" />
        </div>
      </Card>

      {r && (
        <>
          <Card title="IV / EV Analysis" accent>
            <IVBar ivPct={r.ivPct} />
            <div className="mt-3">
              <ResultRow label="Intrinsic Value / share" value={fmtDollar(r.intrinsicPerShare)} />
              <ResultRow label="Extrinsic Value / share" value={fmtDollar(r.extrinsicPerShare)} />
              <ResultRow label="Total contract cost" value={fmtDollar(r.totalCost)} sub={`${fields.contracts} × ${fields.sharesPerContract} shares`} />
              <ResultRow label="Total intrinsic" value={fmtDollar(r.totalIntrinsic)} />
              <ResultRow label="Total extrinsic (time)" value={fmtDollar(r.totalExtrinsic)} />
            </div>
          </Card>

          <Card title="Breakeven">
            <ResultRow
              label="Breakeven price"
              value={fmtDollar(r.breakeven)}
              sub={`Strike ${fmtDollar(parseFloat(fields.strikePrice))} + Premium ${fmtDollar(parseFloat(fields.callPremium))}`}
              badge={fmtPct(r.beAbovePct) + ' above'}
              badgeColor={beColor(r.beAbovePct)}
            />
            <ResultRow label="Buy 100 shares cost" value={fmtDollar(r.buy100Cost)} />
            <p className="text-xs text-slate-500 mt-2">
              Mike Yuen rule: BE should be no more than 5% above current price (10% max)
            </p>
          </Card>

          <Card title="Rules Check">
            <div className="flex flex-wrap gap-2">
              <StatusPill
                ok={r.beAbovePct <= 0.05}
                warn={r.beAbovePct > 0.05 && r.beAbovePct <= 0.10}
                label={`BE ${fmtPct(r.beAbovePct)} above`}
              />
              <StatusPill
                ok={r.costRulePct <= 1 / 3}
                warn={r.costRulePct > 1 / 3 && r.costRulePct <= 0.5}
                label={`Cost ${fmtPct(r.costRulePct)} of stock`}
              />
              <StatusPill
                ok={r.ivPct >= 0.40 && r.ivPct <= 0.60}
                warn={(r.ivPct >= 0.30 && r.ivPct < 0.40) || (r.ivPct > 0.60 && r.ivPct <= 0.70)}
                label={`IV ${fmtPct(r.ivPct)} balanced`}
              />
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <p>• Cost cap: premium ≤ ⅓ of stock price</p>
              <p>• Target 50/50 IV/EV mix (avoid deep ITM)</p>
              <p>• BE: ≤5% above current (10% max)</p>
            </div>
          </Card>
        </>
      )}

      {!hasInputs && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Enter current price, strike, and call premium to calculate
        </div>
      )}
    </div>
  )
}
