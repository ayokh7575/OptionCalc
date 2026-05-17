import { useState } from 'react'
import LongCall from './pages/LongCall'
import SyntheticLong from './pages/SyntheticLong'
import StrikeTable from './pages/StrikeTable'
import Guidelines from './pages/Guidelines'
import './index.css'

const TABS = [
  { id: 'longcall', label: 'Long Call', icon: '📈' },
  { id: 'synthetic', label: 'Synthetic', icon: '⚡' },
  { id: 'strikes', label: 'Strikes', icon: '🎯' },
  { id: 'rules', label: 'Rules', icon: '📋' },
]

export default function App() {
  const [tab, setTab] = useState('longcall')

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col max-w-lg mx-auto">
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-4">
        <div className="flex items-baseline justify-between pt-4 pb-2">
          <div>
            <h1 className="text-lg font-bold text-white m-0">Option Calculator</h1>
            <p className="text-xs text-slate-500 m-0">IV / EV Analysis</p>
          </div>
          <span className="text-xs text-indigo-400 font-medium bg-indigo-900/30 px-2 py-1 rounded-full border border-indigo-800">
            v1.0
          </span>
        </div>

        <div className="flex gap-1 pb-3">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border-0 cursor-pointer ${
                tab === t.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 bg-transparent'
              }`}
            >
              <div>{t.icon}</div>
              <div>{t.label}</div>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        {tab === 'longcall' && <LongCall />}
        {tab === 'synthetic' && <SyntheticLong />}
        {tab === 'strikes' && <StrikeTable />}
        {tab === 'rules' && <Guidelines />}
      </main>
    </div>
  )
}
