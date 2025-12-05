import { useState } from 'react'

// Simple line chart component
function LineChart({ data, color, height = 120 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E5E7EB" strokeWidth="0.5" />
      ))}
      {/* Area fill */}
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// Bar chart component
function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value))
  
  return (
    <div className="flex items-end gap-3 h-[160px]">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div 
            className="w-full rounded-t-md transition-all hover:opacity-80"
            style={{ 
              height: `${(item.value / max) * 100}%`, 
              backgroundColor: item.color,
              minHeight: '8px'
            }}
          />
          <span className="text-xs text-gray-500 text-center">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

interface MetricCardDetailedProps {
  label: string
  value: string
  change: string
  isPositive: boolean
  chartData: number[]
  chartColor: string
}

function MetricCardDetailed({ label, value, change, isPositive, chartData, chartColor }: MetricCardDetailedProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm text-gray-500 mb-1">{label}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          isPositive ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
        }`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={!isPositive ? 'rotate-180' : ''}>
            <path d="M6 2v8M6 2l3 3M6 2L3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {change}
        </div>
      </div>
      <LineChart data={chartData} color={chartColor} />
    </div>
  )
}

export default function UsageOutcomesTab() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const metrics: MetricCardDetailedProps[] = [
    { 
      label: 'Daily Active Users (DAU)', 
      value: '47,234', 
      change: '+8.2%', 
      isPositive: true,
      chartData: [32, 35, 38, 42, 40, 44, 47, 45, 48, 47, 50, 47],
      chartColor: '#3B82F6'
    },
    { 
      label: 'Monthly Active Users (MAU)', 
      value: '847,892', 
      change: '+2.1%', 
      isPositive: true,
      chartData: [780, 790, 810, 820, 815, 830, 840, 835, 845, 850, 848, 848],
      chartColor: '#8B5CF6'
    },
    { 
      label: 'DAU/MAU Ratio', 
      value: '36.8%', 
      change: '+1.8pts', 
      isPositive: true,
      chartData: [32, 33, 33.5, 34, 34.5, 35, 35.2, 35.8, 36, 36.2, 36.5, 36.8],
      chartColor: '#10B981'
    },
    { 
      label: 'New Users', 
      value: '2,234', 
      change: '-2.1%', 
      isPositive: false,
      chartData: [2800, 2700, 2650, 2600, 2500, 2450, 2400, 2350, 2300, 2280, 2250, 2234],
      chartColor: '#F59E0B'
    },
    { 
      label: 'Avg Session Duration', 
      value: '4.2 min', 
      change: '-5.3%', 
      isPositive: false,
      chartData: [5.2, 5.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.25, 4.22, 4.2],
      chartColor: '#EF4444'
    },
    { 
      label: 'User Retention (30d)', 
      value: '89%', 
      change: '+3.2%', 
      isPositive: true,
      chartData: [82, 83, 84, 85, 85.5, 86, 86.5, 87, 87.5, 88, 88.5, 89],
      chartColor: '#06B6D4'
    },
  ]

  const featureUsage = [
    { label: 'Dashboard', value: 78, color: '#3B82F6' },
    { label: 'Reports', value: 65, color: '#8B5CF6' },
    { label: 'Analytics', value: 52, color: '#10B981' },
    { label: 'Integrations', value: 45, color: '#F59E0B' },
    { label: 'Settings', value: 28, color: '#6B7280' },
  ]

  const userSegments = [
    { label: 'Power Users', value: 12, color: '#3B82F6' },
    { label: 'Regular', value: 45, color: '#10B981' },
    { label: 'Occasional', value: 28, color: '#F59E0B' },
    { label: 'New', value: 15, color: '#8B5CF6' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Usage & Outcomes</h2>
          <p className="text-sm text-gray-500 mt-1">Track product performance and user engagement metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Data Source */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Data source: Looker
        </span>
        <span>Last updated: 10 mins ago</span>
        <button className="text-blue-600 hover:text-blue-700">Refresh</button>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCardDetailed key={metric.label} {...metric} />
        ))}
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Feature Usage */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Feature Usage</h3>
          <div className="space-y-3">
            {featureUsage.map((feature) => (
              <div key={feature.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{feature.label}</span>
                  <span className="text-sm font-medium text-gray-900">{feature.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${feature.value}%`, backgroundColor: feature.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Segments */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">User Segments</h3>
          <BarChart data={userSegments} />
          <div className="flex justify-center gap-4 mt-4">
            {userSegments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: segment.color }}></div>
                <span className="text-xs text-gray-600">{segment.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Funnel */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">User Engagement Funnel</h3>
        <div className="flex items-center gap-4">
          {[
            { label: 'Visitors', value: '125K', percent: 100 },
            { label: 'Sign-ups', value: '45K', percent: 36 },
            { label: 'Activated', value: '28K', percent: 22.4 },
            { label: 'Engaged', value: '18K', percent: 14.4 },
            { label: 'Retained', value: '12K', percent: 9.6 },
          ].map((step, index) => (
            <div key={step.label} className="flex-1 relative">
              <div 
                className="h-16 bg-blue-500 rounded-lg flex items-center justify-center"
                style={{ 
                  opacity: 1 - (index * 0.15),
                  clipPath: index < 4 ? 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%)',
                  marginLeft: index > 0 ? '-8px' : 0
                }}
              >
                <span className="text-white font-bold text-lg">{step.value}</span>
              </div>
              <div className="text-center mt-2">
                <div className="text-sm font-medium text-gray-900">{step.label}</div>
                <div className="text-xs text-gray-500">{step.percent}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

