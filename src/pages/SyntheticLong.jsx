import InputField from '../components/InputField'
import ResultRow from '../components/ResultRow'
import Card from '../components/Card'
import { calcSyntheticLong, fmtPct, fmtDollar } from '../utils/calculations'
import { useLocalState } from '../hooks/useLocalState'

const INITIAL = {
  ticker: '',
  currentPrice: '',
  callPremium: '',
  putPremium: '',
  strikePrice: '',
  contracts: '1',
  sharesPerContract: '100',
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
        {isBalanced ? '✓ Good 50/50 balance' : pct > 80 ? '⚠ Deep ITM — mostly intrinsic' : 'Target: 50/50 mix'}
      </p>
    </div>
  )
}

export default function SyntheticLong() {
  const [fields, setFields, resetFields] = useLocalState('synthetic', INITIAL)

  const set = key => val => setFields(f => ({ ...f, [key]: val }))

  const hasInputs = fields.currentPrice && fields.callPremium && fields.putPremium && fields.strikePrice
  const r = hasInputs ? calcSyntheticLong(fields) : null

  return (
    <div className="space-y-4">
      <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-xl p-3 text-xs text-indigo-300">
        <strong>Synthetic Long</strong> = Buy a Call + Sell a Put at the same strike. Net cost = Call Premium − Put Premium.
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Inputs</h2>
          <button
            onClick={resetFields}
            className="text-xs text-slate-500 hover:text-red-400 border border-slate-700 hover:border-red-800 px-2.5 py-1 rounded-lg transition-colors bg-transparent cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <InputField label="Ticker Symbol" value={fields.ticker} onChange={set('ticker')} placeholder="e.g. DRI" type="text" uppercase />
          </div>
          <InputField label="Current Price" value={fields.currentPrice} onChange={set('currentPrice')} prefix="$" placeholder="206.17" />
          <InputField label="Strike Price" value={fields.strikePrice} onChange={set('strikePrice')} prefix="$" placeholder="200.00" />
          <InputField label="Call Premium" value={fields.callPremium} onChange={set('callPremium')} prefix="$" placeholder="61.97" />
          <InputField label="Put Premium" value={fields.putPremium} onChange={set('putPremium')} prefix="$" placeholder="49.93" />
          <InputField label="# of Contracts" value={fields.contracts} onChange={set('contracts')} placeholder="1" />
          <InputField label="Shares / Contract" value={fields.sharesPerContract} onChange={set('sharesPerContract')} placeholder="100" />
        </div>
      </Card>

      {r && (
        <>
          <Card title="IV / EV Analysis" accent>
            <IVBar ivPct={r.ivPct} />
            <div className="mt-3">
              <ResultRow label="Net premium (Call − Put)" value={fmtDollar(r.netPremium)} />
              <ResultRow label="Intrinsic Value / share" value={fmtDollar(r.intrinsicPerShare)} />
              <ResultRow label="Extrinsic Value / share" value={fmtDollar(r.extrinsicPerShare)} />
              <ResultRow label="Total position value" value={fmtDollar(r.totalValue)} sub={`${fields.contracts} × ${fields.sharesPerContract} shares`} />
            </div>
          </Card>

          <Card title="IV / EV Split">
            <ResultRow label="Intrinsic %" value={fmtPct(r.ivPct)} />
            <ResultRow label="Extrinsic %" value={fmtPct(r.evPct)} />
            <p className="text-xs text-slate-500 mt-2">Target: ~50/50 mix of intrinsic vs extrinsic value</p>
          </Card>
        </>
      )}

      {!hasInputs && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Enter current price, strike, call premium, and put premium to calculate
        </div>
      )}
    </div>
  )
}
