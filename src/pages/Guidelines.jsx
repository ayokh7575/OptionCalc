import Card from '../components/Card'

function Rule({ num, text }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-slate-700/50 last:border-0">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-900/60 border border-indigo-700 text-indigo-400 text-xs font-bold flex items-center justify-center">
        {num}
      </span>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  )
}

function Tag({ color, children }) {
  const colors = {
    green: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
    red: 'bg-red-900/40 text-red-400 border-red-800',
    amber: 'bg-amber-900/40 text-amber-400 border-amber-800',
    blue: 'bg-indigo-900/40 text-indigo-400 border-indigo-800',
  }
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-lg border font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

export default function Guidelines() {
  return (
    <div className="space-y-4">
      <Card title="Overall Option Guidelines">
        <Rule num="1" text="Buy ITM when VIX is LOW (over 1 yr out) = LEAPS → when BUY signals!" />
        <Rule num="2" text="Sell OTM when VIX is HIGH (less than 45 days out) = Covered Calls → when SELL signals!" />
        <Rule num="3" text="Shoot for 50/50 mix of Intrinsic / Extrinsic Value when buying long calls or LEAPS (avoid deep ITM)" />
        <Rule num="4" text="Cost: capped at ⅓ of stock price (e.g. $3.30 for a $10 stock)" />
        <Rule num="5" text="For SL's, sell puts on violent dips, use juicy cash to buy calls (ONLY at bottoms!)" />
      </Card>

      <Card title="Covered Call Sweet Spot">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Tag color="blue">30–45 days out</Tag>
          <Tag color="blue">After gamma squeeze</Tag>
          <Tag color="blue">At a top</Tag>
          <Tag color="blue">When models say</Tag>
          <Tag color="blue">Rich premiums</Tag>
          <Tag color="blue">High volatility</Tag>
        </div>
        <p className="text-xs text-slate-500">Enter covered calls when VIX is HIGH — premiums are rich.</p>
      </Card>

      <Card title="Mike Yuen's Breakeven Rule">
        <div className="flex gap-3 mb-3">
          <Tag color="green">≤ 5% above current → Ideal</Tag>
        </div>
        <div className="flex gap-3 mb-3">
          <Tag color="amber">5–10% above → Acceptable</Tag>
        </div>
        <div className="flex gap-3">
          <Tag color="red">&gt; 10% above → Avoid</Tag>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Breakeven = Strike Price + Option Premium. The closer BE is to the current price, the faster the trade profits.
        </p>
      </Card>

      <Card title="VIX Guide">
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">VIX Low</span>
            <div className="flex gap-2 flex-wrap justify-end">
              <Tag color="green">Buy ITM</Tag>
              <Tag color="green">LEAPS (&gt;1 yr)</Tag>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-400">VIX High</span>
            <div className="flex gap-2 flex-wrap justify-end">
              <Tag color="red">Sell OTM</Tag>
              <Tag color="red">Covered Calls</Tag>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Cost Rule">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-sm text-slate-300 font-mono text-center">Premium ≤ Stock Price ÷ 3</p>
        </div>
        <div className="mt-3 space-y-1 text-xs text-slate-500">
          <p>$10 stock → max premium $3.33</p>
          <p>$100 stock → max premium $33.33</p>
          <p>$200 stock → max premium $66.67</p>
        </div>
      </Card>

      <Card title="IV / EV Target">
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-1/2" />
        </div>
        <p className="text-xs text-slate-500 text-center">Target 50% Intrinsic / 50% Extrinsic</p>
        <div className="mt-3 space-y-1 text-xs text-slate-500">
          <p>• High intrinsic % = deep ITM → expensive, less leverage</p>
          <p>• High extrinsic % = mostly time value → option decays faster</p>
          <p>• 50/50 balance = sweet spot for long calls and LEAPS</p>
        </div>
      </Card>
    </div>
  )
}
