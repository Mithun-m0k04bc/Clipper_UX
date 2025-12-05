import { useState } from 'react'

interface Objective {
  id: string
  level: 'L1' | 'L2' | 'L3' | 'L4'
  title: string
  progress: number
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed'
  owner: { name: string; initials: string; color: string }
  keyResults: KeyResult[]
  dueDate: string
}

interface KeyResult {
  id: string
  title: string
  target: number
  current: number
  unit: string
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed'
}

const objectives: Objective[] = [
  {
    id: '1',
    level: 'L3',
    title: 'Highly Available & Resilient Platform',
    progress: 75,
    status: 'On Track',
    owner: { name: 'Jordyn Saris', initials: 'JS', color: 'bg-purple-400' },
    dueDate: 'Q4 2024',
    keyResults: [
      { id: '1-1', title: 'Achieve 99.9% platform uptime', target: 99.9, current: 99.85, unit: '%', status: 'On Track' },
      { id: '1-2', title: 'Reduce mean time to recovery (MTTR)', target: 15, current: 18, unit: 'min', status: 'At Risk' },
      { id: '1-3', title: 'Zero critical security incidents', target: 0, current: 0, unit: 'incidents', status: 'Completed' },
    ]
  },
  {
    id: '2',
    level: 'L4',
    title: 'Boost developer productivity with a 30% reduction in KTLO',
    progress: 65,
    status: 'At Risk',
    owner: { name: 'Mira Schleifer', initials: 'MS', color: 'bg-teal-400' },
    dueDate: 'Q4 2024',
    keyResults: [
      { id: '2-1', title: 'Reduce KTLO hours by 30%', target: 30, current: 22, unit: '%', status: 'At Risk' },
      { id: '2-2', title: 'Automate 50 manual processes', target: 50, current: 38, unit: 'processes', status: 'At Risk' },
      { id: '2-3', title: 'Improve developer satisfaction score', target: 4.5, current: 4.2, unit: '/5', status: 'On Track' },
    ]
  },
  {
    id: '3',
    level: 'L4',
    title: 'Strengthen confidence by ensuring platforms are secure and compliant by default',
    progress: 82,
    status: 'On Track',
    owner: { name: 'Kaiya Schleifer', initials: 'KS', color: 'bg-orange-400' },
    dueDate: 'Q4 2024',
    keyResults: [
      { id: '3-1', title: 'Complete SOC2 Type II certification', target: 100, current: 95, unit: '%', status: 'On Track' },
      { id: '3-2', title: 'Implement zero-trust architecture', target: 100, current: 78, unit: '%', status: 'On Track' },
      { id: '3-3', title: 'Automated security scanning coverage', target: 100, current: 100, unit: '%', status: 'Completed' },
    ]
  },
  {
    id: '4',
    level: 'L3',
    title: 'Enable data-driven decision making across the organization',
    progress: 45,
    status: 'Behind',
    owner: { name: 'Jordyn Saris', initials: 'JS', color: 'bg-purple-400' },
    dueDate: 'Q1 2025',
    keyResults: [
      { id: '4-1', title: 'Deploy unified analytics dashboard', target: 100, current: 35, unit: '%', status: 'Behind' },
      { id: '4-2', title: 'Train 500 users on data tools', target: 500, current: 180, unit: 'users', status: 'Behind' },
      { id: '4-3', title: 'Integrate 10 data sources', target: 10, current: 6, unit: 'sources', status: 'At Risk' },
    ]
  },
]

function StatusBadge({ status }: { status: Objective['status'] }) {
  const styles = {
    'On Track': 'bg-green-100 text-green-700',
    'At Risk': 'bg-orange-100 text-orange-700',
    'Behind': 'bg-red-100 text-red-600',
    'Completed': 'bg-blue-100 text-blue-700',
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}

function LevelBadge({ level }: { level: Objective['level'] }) {
  const styles = {
    'L1': 'bg-gray-800 text-white',
    'L2': 'bg-blue-600 text-white',
    'L3': 'bg-blue-100 text-blue-700',
    'L4': 'bg-purple-100 text-purple-700',
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs font-bold rounded ${styles[level]}`}>
      {level}
    </span>
  )
}

function ProgressBar({ progress, status }: { progress: number; status: Objective['status'] }) {
  const colors = {
    'On Track': 'bg-green-500',
    'At Risk': 'bg-orange-500',
    'Behind': 'bg-red-500',
    'Completed': 'bg-blue-500',
  }
  
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all ${colors[status]}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function ObjectiveCard({ objective, isExpanded, onToggle }: { objective: Objective; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <button className="mt-1">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
              className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            >
              <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <LevelBadge level={objective.level} />
              <h3 className="font-medium text-gray-900">{objective.title}</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-gray-700">{objective.progress}%</span>
                </div>
                <ProgressBar progress={objective.progress} status={objective.status} />
              </div>
              
              <StatusBadge status={objective.status} />
              
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 ${objective.owner.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                  {objective.owner.initials}
                </div>
                <span className="text-sm text-gray-600">{objective.owner.name}</span>
              </div>
              
              <span className="text-sm text-gray-500">{objective.dueDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Results */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Key Results ({objective.keyResults.length})</h4>
          <div className="space-y-3">
            {objective.keyResults.map((kr) => (
              <div key={kr.id} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-900">{kr.title}</span>
                  <StatusBadge status={kr.status} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          kr.status === 'Completed' ? 'bg-blue-500' :
                          kr.status === 'On Track' ? 'bg-green-500' :
                          kr.status === 'At Risk' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((kr.current / kr.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    {kr.current}{kr.unit} / {kr.target}{kr.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ObjectiveAlignmentTab() {
  const [expandedIds, setExpandedIds] = useState<string[]>(['1'])
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const filteredObjectives = filterStatus === 'all' 
    ? objectives 
    : objectives.filter(o => o.status === filterStatus)

  const statusCounts = {
    'On Track': objectives.filter(o => o.status === 'On Track').length,
    'At Risk': objectives.filter(o => o.status === 'At Risk').length,
    'Behind': objectives.filter(o => o.status === 'Behind').length,
    'Completed': objectives.filter(o => o.status === 'Completed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Objective Alignment</h2>
          <p className="text-sm text-gray-500 mt-1">Track OKRs and key results aligned to product goals</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Objective
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div 
            key={status}
            className={`p-4 rounded-xl border cursor-pointer transition-colors ${
              filterStatus === status ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
          >
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-sm text-gray-500">{status}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Filter:</span>
        <div className="flex gap-2">
          {['all', 'On Track', 'At Risk', 'Behind', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {filteredObjectives.map((objective) => (
          <ObjectiveCard
            key={objective.id}
            objective={objective}
            isExpanded={expandedIds.includes(objective.id)}
            onToggle={() => toggleExpanded(objective.id)}
          />
        ))}
      </div>

      {filteredObjectives.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No objectives found with the selected filter.
        </div>
      )}
    </div>
  )
}

