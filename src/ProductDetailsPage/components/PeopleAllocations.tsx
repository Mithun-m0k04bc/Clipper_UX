export default function PeopleAllocations() {
  const allocations = [
    { label: 'Full Time Associates', value: 10.9, color: 'bg-blue-600', width: '40%' },
    { label: 'Consultants', value: 4.3, color: 'bg-teal-500', width: '25%' },
    { label: 'Contractors', value: 1, color: 'bg-orange-400', width: '10%' },
    { label: 'Unassigned', value: 1, color: 'bg-gray-300', width: '10%' },
  ]

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">People Allocations</h3>
      
      {/* Total Count */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl font-bold text-gray-900">16</span>
        <span className="text-sm text-gray-500">People Allocated</span>
        <span className="flex items-center gap-1 text-xs text-green-600 ml-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M6 2l3 3M6 2L3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          +2.2% new allocations
        </span>
      </div>

      {/* Stacked Bar */}
      <div className="flex h-6 rounded-lg overflow-hidden mb-3">
        {allocations.map((item) => (
          <div
            key={item.label}
            className={`${item.color} flex items-center justify-center text-white text-xs font-medium`}
            style={{ width: item.width }}
          >
            {item.value}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6">
        {allocations.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

