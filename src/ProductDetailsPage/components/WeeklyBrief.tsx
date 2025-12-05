const MagicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1l1.5 4.5H14l-3.5 3 1.5 4.5L8 10l-4 3 1.5-4.5L2 5.5h4.5L8 1z" fill="#7B61FF"/>
  </svg>
)

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5 2h6v5a3 3 0 01-6 0V2zM3 3H5v2H3a1 1 0 01-1-1v0a1 1 0 011-1zM11 3h2a1 1 0 011 1v0a1 1 0 01-1 1h-2V3zM6 10v2h4v-2M5 14h6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="#EF4444" strokeWidth="1.5"/>
    <path d="M8 5v3M8 10.5v.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5 4h8M5 8h8M5 12h8M2 4h.5M2 8h.5M2 12h.5" stroke="#0071DC" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export default function WeeklyBrief() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MagicIcon />
          <h3 className="font-semibold text-gray-900">Weekly Brief</h3>
          <span className="text-sm text-gray-500">– Week 12 ( Nov 24 - Nov 30)</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l1.5 4.5H14l-3.5 3 1.5 4.5L8 10l-4 3 1.5-4.5L2 5.5h4.5L8 1z" fill="currentColor"/>
          </svg>
          Ask Wibey
        </button>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
        GTP - Clipper is experiencing strong user engagement growth (+8.2% DAU) but facing critical budget challenges. 
        The product is tracking toward OKR goals (L3: 75%, Team: 65%) but operational costs have exceeded budget by 39% 
        ($47K/month), primarily due to high compute utilization (78%) and storage growth (85% utilized). Team headcount 
        increased by +18 net additions beyond the planned 152.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Strengths */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <TrophyIcon />
            <span className="font-medium text-gray-900 text-sm">Strengths</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• DAU growth on track (94% of target)</li>
            <li>• Platform stability strong (99.9% uptime)</li>
            <li>• User retention improving (89%)</li>
          </ul>
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertIcon />
            <span className="font-medium text-gray-900 text-sm">Critical Issues</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Cloud utilization at 78-85%</li>
            <li>• +18 net additions over plan</li>
          </ul>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <ListIcon />
            <span className="font-medium text-gray-900 text-sm">Action Items</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Optimize cloud utilization</li>
            <li>• Implement cost controls</li>
            <li>• Optimize FTE/contractor ratio</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

