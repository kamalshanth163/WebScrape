import type { Analytics } from '../api/client'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function AnalyticsCards({ analytics }: { analytics: Analytics }) {
  const cards = [
    { label: 'Total jobs', value: analytics.totalJobs, color: 'text-blue-400' },
    { label: 'Successful', value: analytics.successfulJobs, color: 'text-green-400' },
    { label: 'Success rate', value: `${analytics.successRate}%`, color: 'text-emerald-400' },
    { label: 'Data collected', value: formatBytes(analytics.totalBytesCollected), color: 'text-purple-400' }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{c.label}</p>
          <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
        </div>
      ))}
      {analytics.upcomingJobs.length > 0 && (
        <div className="col-span-2 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Upcoming schedules</p>
          <div className="flex flex-wrap gap-3">
            {analytics.upcomingJobs.map(j => (
              <div key={j.name} className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-sm text-slate-300">{j.name}</span>
                <span className="text-xs text-slate-500">
                  {new Date(j.nextRun).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}