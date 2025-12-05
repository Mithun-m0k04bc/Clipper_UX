import { useState } from 'react'
import Breadcrumb from './Breadcrumb'
import ProductHeader from './ProductHeader'
import TeamMembers from './TeamMembers'
import OverviewTab from './tabs/OverviewTab'
import UsageOutcomesTab from './tabs/UsageOutcomesTab'
import ObjectiveAlignmentTab from './tabs/ObjectiveAlignmentTab'
import PeopleAllocationsTab from './tabs/PeopleAllocationsTab'
import AIInsightsTab from './tabs/AIInsightsTab'
import type { TabType } from './types'
import styles from './TabNavigation.module.css'
import { MagicIcon } from './shared/CustomIcons'
import Tag from './shared/Tag'

const tabs: { id: TabType; name: string; badge?: string }[] = [
  { id: 'overview', name: 'Overview' },
  { id: 'usage', name: 'Usage & Outcomes' },
  { id: 'objectives', name: 'Objective Alignment' },
  { id: 'allocations', name: 'People Allocations' },
  { id: 'insights', name: 'AI Insights', badge: 'NEW' },
]

export default function MainContent() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  return (
    <main className="flex-1 h-full overflow-y-auto bg-white">
      <div className="p-6 max-w-[950px]">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Product Header */}
        <ProductHeader />

        {/* Team Members */}
        <TeamMembers />

        {/* Tab Navigation - Living Design Styled */}
        <div className={styles.tabContainer}>
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            >
              {tab.id === 'insights' && <MagicIcon className="text-[#7B61FF]" />}
              {tab.name}
              {tab.badge && <Tag variant="blue" size="sm">{tab.badge}</Tag>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div key={activeTab}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'usage' && <UsageOutcomesTab />}
          {activeTab === 'objectives' && <ObjectiveAlignmentTab />}
          {activeTab === 'allocations' && <PeopleAllocationsTab />}
          {activeTab === 'insights' && <AIInsightsTab />}
        </div>
      </div>
    </main>
  )
}
