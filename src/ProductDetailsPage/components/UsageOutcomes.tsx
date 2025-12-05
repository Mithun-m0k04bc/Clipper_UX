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

export default function UsageOutcomes() {
  const metrics: MetricCardProps[] = [
    { label: 'DAU', value: '47K', change: '+8.2% vs last 30d', isPositive: true },
    { label: 'MAU', value: '847K', change: '+2.1% vs last period', isPositive: true },
    { label: 'DAU/MAU Ratio', value: '36.8%', change: '+1.8 pts vs last period', isPositive: true },
    { label: 'New Users', value: '2.2K', change: '-2.1% vs last period', isPositive: false },
    { label: 'Avg Session Duration', value: '4.2 min', change: '-5.3% vs last period', isPositive: false },
  ]

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Usage & Outcomes</h3>
        <span className="text-xs text-gray-400">Data source: Looker · Last updated: 10 mins ago</span>
      </div>
      
      <div className="grid grid-cols-5 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
    </div>
  )
}

