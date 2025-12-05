interface MetricCardProps {
  label: string
  value: string
  change: string
  isPositive: boolean
}

function MetricCard({ label, value, change, isPositive }: MetricCardProps) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={!isPositive ? 'rotate-180' : ''}>
          <path d="M6 2v8M6 2l3 3M6 2L3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {change}
      </div>
    </div>
  )
}

export default function JiraEpicsAnalysis() {
  const metrics: MetricCardProps[] = [
    { label: 'Total epics', value: '24', change: '+5 vs last quarter', isPositive: true },
    { label: 'Total Tickets', value: '123', change: '+25 vs last quarter', isPositive: true },
    { label: 'Epics at Risk', value: '4', change: '+1.8 pts vs last period', isPositive: true },
    { label: 'OKR Coverage', value: '82%', change: 'Orphan epics: 3', isPositive: false },
  ]

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">JIRA Epics Analysis</h3>
        <span className="text-xs text-gray-400">Data source: JIRA · Last updated: 10 mins ago</span>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
    </div>
  )
}

