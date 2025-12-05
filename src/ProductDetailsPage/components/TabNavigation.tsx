import type { TabType } from './types'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; name: string; badge?: string }[] = [
  { id: 'overview', name: 'Overview' },
  { id: 'usage', name: 'Usage & Outcomes' },
  { id: 'objectives', name: 'Objective Alignment' },
  { id: 'allocations', name: 'People Allocations' },
  { id: 'insights', name: 'AI Insights', badge: 'NEW' },
]

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const handleTabClick = (tabId: TabType) => {
    console.log('Tab clicked:', tabId)
    onTabChange(tabId)
  }

  return (
    <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === tab.id
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.id === 'insights' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={activeTab === tab.id ? 'text-blue-600' : 'text-blue-500'}>
              <path d="M8 1l1.5 4.5H14l-3.5 3 1.5 4.5L8 10l-4 3 1.5-4.5L2 5.5h4.5L8 1z" fill="currentColor"/>
            </svg>
          )}
          {tab.name}
          {tab.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-600 rounded">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
