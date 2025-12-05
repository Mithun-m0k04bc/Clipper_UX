interface ObjectiveRowProps {
  l3Tag: string
  l4Tag: string
  l3Label: string
  l4Label: string
  krDescription: string
  avatarInitials: string
  avatarColor: string
  quarter: string
  status: 'On Track' | 'Behind' | 'At Risk'
}

const objectives: ObjectiveRowProps[] = [
  {
    l3Tag: 'L3',
    l4Tag: 'L4',
    l3Label: 'Highly Available & Resilient Platform',
    l4Label: 'Boost developer productivity with a 30% reduction in KTLO',
    krDescription: 'Deliver the Initiative–Product Mapping Proof of Concept (POC) within Clipper to enable product-level visibility and headcount distribution for GTP Initiatives.',
    avatarInitials: 'JS',
    avatarColor: 'bg-purple-400',
    quarter: 'V1',
    status: 'Behind',
  },
  {
    l3Tag: 'L3',
    l4Tag: 'L4',
    l3Label: 'Highly Available & Resilient Platform',
    l4Label: 'Strengthen confidence by ensuring platforms are secure and compliant by default',
    krDescription: 'Complete the Initiative–Product Mapping Proof of Concept (POC) in Clipper to enhance visibility at the product level and optimize headcount allocation for GTP Initiatives.',
    avatarInitials: 'JS',
    avatarColor: 'bg-purple-400',
    quarter: 'V1',
    status: 'Behind',
  },
]

function StatusBadge({ status }: { status: ObjectiveRowProps['status'] }) {
  const colors = {
    'On Track': 'bg-green-100 text-green-700',
    'Behind': 'bg-red-100 text-red-600',
    'At Risk': 'bg-orange-100 text-orange-600',
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[status]}`}>
      {status}
    </span>
  )
}

function ObjectiveRow({ l3Label, l4Label, krDescription, avatarInitials, avatarColor, quarter, status }: ObjectiveRowProps) {
  return (
    <div className="py-3">
      {/* Objective Labels */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">L3</span>
        <span className="text-sm text-gray-700">{l3Label}</span>
        <span className="text-gray-400">/</span>
        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-700 rounded">L4</span>
        <span className="text-sm text-gray-700">{l4Label}</span>
      </div>
      
      {/* KR Row */}
      <div className="flex items-start gap-3">
        <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded shrink-0 mt-0.5">Team</span>
        <p className="text-sm text-gray-700 flex-1">{krDescription}</p>
        <div className="flex items-center gap-2 shrink-0">
          {/* Spot Icon */}
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#22C55E" strokeWidth="1.5"/>
              <path d="M5 7l1.5 1.5L9 5.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Avatar */}
          <div className={`w-8 h-8 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
            {avatarInitials}
          </div>
          {/* Quarter */}
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">{quarter}</span>
          {/* Status */}
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  )
}

export default function ObjectiveAlignment() {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">Objective Alignment (2)</h3>
      
      <div className="divide-y divide-gray-200">
        {objectives.map((obj, index) => (
          <ObjectiveRow key={index} {...obj} />
        ))}
      </div>
    </div>
  )
}

