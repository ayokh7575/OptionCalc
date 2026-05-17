export function calcLongCall({ currentPrice, callPremium, strikePrice, contracts = 1, sharesPerContract = 100 }) {
  const cp = parseFloat(currentPrice) || 0
  const prem = parseFloat(callPremium) || 0
  const strike = parseFloat(strikePrice) || 0
  const qty = parseFloat(contracts) || 1
  const shares = parseFloat(sharesPerContract) || 100

  const intrinsicPerShare = Math.max(cp - strike, 0)
  const extrinsicPerShare = Math.max(prem - intrinsicPerShare, 0)
  const totalCost = prem * qty * shares
  const totalIntrinsic = intrinsicPerShare * qty * shares
  const totalExtrinsic = extrinsicPerShare * qty * shares
  const ivPct = prem > 0 ? intrinsicPerShare / prem : 0
  const evPct = prem > 0 ? extrinsicPerShare / prem : 0
  const breakeven = strike + prem
  const beAbovePct = cp > 0 ? (breakeven - cp) / cp : 0
  const costRulePct = cp > 0 ? prem / cp : 0
  const buy100Cost = cp * 100

  return {
    intrinsicPerShare,
    extrinsicPerShare,
    totalCost,
    totalIntrinsic,
    totalExtrinsic,
    ivPct,
    evPct,
    breakeven,
    beAbovePct,
    costRulePct,
    buy100Cost,
  }
}

export function calcSyntheticLong({ currentPrice, callPremium, putPremium, strikePrice, contracts = 1, sharesPerContract = 100 }) {
  const cp = parseFloat(currentPrice) || 0
  const callP = parseFloat(callPremium) || 0
  const putP = parseFloat(putPremium) || 0
  const strike = parseFloat(strikePrice) || 0
  const qty = parseFloat(contracts) || 1
  const shares = parseFloat(sharesPerContract) || 100

  const netPremium = callP - putP
  const intrinsicPerShare = cp - strike
  const extrinsicPerShare = netPremium - intrinsicPerShare
  const ivPct = netPremium !== 0 ? intrinsicPerShare / netPremium : 0
  const evPct = netPremium !== 0 ? extrinsicPerShare / netPremium : 0
  const totalValue = netPremium * qty * shares

  return {
    netPremium,
    intrinsicPerShare,
    extrinsicPerShare,
    ivPct,
    evPct,
    totalValue,
  }
}

export function calcStrikeRow(currentPrice, strikePrice, midpoint) {
  const cp = parseFloat(currentPrice) || 0
  const strike = parseFloat(strikePrice) || 0
  const mid = parseFloat(midpoint) || 0

  const pctBelow = cp > 0 ? (strike - cp) / cp : 0
  const breakeven = strike + mid
  const beAbovePct = cp > 0 ? (breakeven - cp) / cp : 0

  return { pctBelow, breakeven, beAbovePct }
}

export function beColor(pct) {
  if (pct <= 0.05) return 'green'
  if (pct <= 0.10) return 'yellow'
  return 'red'
}

export function fmt(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toFixed(decimals)
}

export function fmtPct(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return (n * 100).toFixed(2) + '%'
}

export function fmtDollar(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
