interface DonutChartProps {
  title: string
  dataSource: string
  total: number
  label: string
  data: { label: string; value: number; color: string }[]
}

function DonutChart({ title, dataSource, total, label, data }: DonutChartProps) {
  // Calculate percentages and create the conic gradient
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0
  const gradientStops = data.map((item) => {
    const percentage = (item.value / totalValue) * 100
    const start = currentAngle
    currentAngle += percentage
    return `${item.color} ${start}% ${currentAngle}%`
  }).join(', ')

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className="text-xs text-gray-400">{dataSource}</span>
      </div>
      
      <div className="flex gap-6">
        {/* Donut */}
        <div className="relative w-[140px] h-[140px]">
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              background: `conic-gradient(${gradientStops})`,
            }}
          />
          <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{total}</span>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 justify-center">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs font-medium text-gray-900">{item.value}</span>
              <span className="text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AllocationCharts() {
  const plannedData = [
    { label: 'Engineering', value: 11.4, color: '#3B82F6' },
    { label: 'Product Manager', value: 2.4, color: '#14B8A6' },
    { label: 'Operational Sup...', value: 1, color: '#F97316' },
    { label: 'Engineering Man...', value: 0.7, color: '#EAB308' },
    { label: 'UX & Research', value: 0.5, color: '#8B5CF6' },
    { label: 'Program, Project...', value: 0.2, color: '#EC4899' },
    { label: 'Sr Dir and Above', value: 0.1, color: '#6B7280' },
  ]

  const actualData = [
    { label: 'Engineering', value: 5, color: '#3B82F6' },
    { label: 'Product Manager', value: 1, color: '#14B8A6' },
    { label: 'UX & Research', value: 1, color: '#8B5CF6' },
  ]

  return (
    <div className="grid grid-cols-2 gap-8 mb-6">
      <DonutChart
        title="Planned Allocations"
        dataSource="Data source: Clipper"
        total={16}
        label="People"
        data={plannedData}
      />
      <DonutChart
        title="Actual Allocations"
        dataSource="Data source: JIRA"
        total={7}
        label="People"
        data={actualData}
      />
    </div>
  )
}

