export default function RightSidebar() {
  return (
    <aside className="w-[380px] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Wibey</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17 3l-7 7M17 3v5M17 3h-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10v7h7" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5l-5 5-5-5M15 10l-5 5-5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Top Insights Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1l1 3h3l-2.5 2 1 3L6 7 3.5 9l1-3L2 4h3L6 1z" fill="currentColor"/>
            </svg>
            Top Insights
          </span>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="4" width="6" height="6" rx="1" stroke="#9CA3AF" strokeWidth="1"/>
              <path d="M4 4V3a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H8" stroke="#9CA3AF" strokeWidth="1"/>
            </svg>
          </button>
        </div>

        {/* Insights Content */}
        <div className="space-y-4">
          {/* Wins */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500">🏆</span>
              <h4 className="font-semibold text-sm text-gray-900">Wins</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1 pl-6">
              <li>• Showcase key improvements (e.g., performance boosts, incident reductions, or deployment successes) with supporting metrics</li>
            </ul>
          </div>

          {/* Risks & Anomalies */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500">⚠️</span>
              <h4 className="font-semibold text-sm text-gray-900">Risks & Anomalies</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1 pl-6">
              <li>• Highlight recent incidents, anomalies, or configuration issues and actions taken [2]</li>
              <li>• Use Columbo to surface operational risks and anomalies for Clipper-managed workloads</li>
            </ul>
          </div>

          {/* Roadmap Shifts */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-500">🗺️</span>
              <h4 className="font-semibold text-sm text-gray-900">Roadmap Shifts</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1 pl-6">
              <li>• Use Roadmap's Executive View to show shifts in priorities, new features, or timeline changes</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Analyze At Risk Objectives
          </button>
          <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Recovery Action Plan
          </button>
        </div>

        {/* Breakdown */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            I've put together a breakdown of what I can do for you.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Sources (3)</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="3" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1"/>
                <path d="M3 3V2a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10l8-8M10 10V2H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 mb-3">Ask to do or create anything...</div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your question..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

