import { useState } from 'react'
import { IconOrg, IconSubOrg, IconPillar, IconSubPillar, IconProduct, IconApp, ChevronDown, ChevronUp } from './shared/CustomIcons'

interface TreeItem {
  id: string
  name: string
  type: 'org' | 'sub-org' | 'pillar' | 'sub-pillar' | 'product' | 'app'
  children?: TreeItem[]
  expanded?: boolean
  active?: boolean
}

const treeData: TreeItem[] = [
  {
    id: '1',
    name: 'Global Tech',
    type: 'org',
    expanded: true,
    children: [
      { id: '1-1', name: 'CTO Admin Total', type: 'sub-org' },
      { id: '1-2', name: 'EBS Services', type: 'sub-org' },
      { id: '1-3', name: 'EBS Tech', type: 'sub-org' },
      { id: '1-4', name: 'Information Security', type: 'sub-org' },
      { id: '1-5', name: 'International Tech', type: 'sub-org' },
      { id: '1-6', name: 'Sams Club Tech', type: 'sub-org' },
      {
        id: '1-7',
        name: 'Technology Platform',
        type: 'sub-org',
        expanded: true,
        children: [
          { id: '1-7-1', name: 'Cloud and Data Platforms', type: 'pillar' },
          { id: '1-7-2', name: 'Data Engg Maturity', type: 'pillar' },
          {
            id: '1-7-3',
            name: 'Developer Productivity and Gen AI',
            type: 'pillar',
            expanded: true,
            children: [
              {
                id: '1-7-3-1',
                name: 'Developer Productivity',
                type: 'sub-pillar',
                expanded: true,
                children: [
                  { id: '1-7-3-1-1', name: 'Future Archive - GTP - Canonical Pipeline', type: 'product' },
                  { id: '1-7-3-1-2', name: 'GTP - API Lifecycle management', type: 'product' },
                  {
                    id: '1-7-3-1-3',
                    name: 'GTP - Clipper',
                    type: 'product',
                    active: true,
                    expanded: true,
                    children: [
                      { id: 'app-1', name: 'Import - People data from team roasters', type: 'app' },
                      { id: 'app-2', name: 'Import - Initiative data from Portfolio Plannin..', type: 'app' },
                    ]
                  },
                  { id: '1-7-3-1-4', name: 'GTP - Columbo', type: 'product' },
                  { id: '1-7-3-1-5', name: 'GTP - Core - Identity', type: 'product' },
                  { id: '1-7-3-1-6', name: 'GTP - Core - Process', type: 'product' },
                  { id: '1-7-3-1-7', name: 'GTP - Draw.io', type: 'product' },
                  { id: '1-7-3-1-8', name: 'GTP - DX', type: 'product' },
                  { id: '1-7-3-1-9', name: 'GTP - DX Analytics', type: 'product' },
                  { id: '1-7-3-1-10', name: 'GTP - Gate Keeper', type: 'product' },
                  { id: '1-7-3-1-11', name: 'GTP - Github', type: 'product' },
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

const getIcon = (type: TreeItem['type']) => {
  switch (type) {
    case 'org': return <IconOrg />
    case 'sub-org': return <IconSubOrg />
    case 'pillar': return <IconPillar />
    case 'sub-pillar': return <IconSubPillar />
    case 'product': return <IconProduct />
    case 'app': return <IconApp />
    default: return null
  }
}

const TreeNode = ({ item, level = 0 }: { item: TreeItem; level?: number }) => {
  const [expanded, setExpanded] = useState(item.expanded ?? false)
  const hasChildren = item.children && item.children.length > 0
  const paddingLeft = 15 + level * 10

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-gray-100 rounded transition-colors ${
          item.active ? 'bg-blue-50 text-blue-600' : ''
        }`}
        style={{ paddingLeft }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {getIcon(item.type)}
        <span className={`flex-1 text-sm truncate ${item.active ? 'font-medium' : ''}`}>
          {item.name}
        </span>
        {hasChildren && (expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />)}
      </div>
      {hasChildren && expanded && (
        <div>
          {item.children!.map((child) => (
            <TreeNode key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeftSidebar() {
  return (
    <aside className="w-[260px] h-full bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Search */}
      <div className="p-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Search by Keywords</div>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter name, ID"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* All Entities header */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="text-sm font-semibold text-gray-900">All Entities</div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {treeData.map((item) => (
          <TreeNode key={item.id} item={item} />
        ))}
      </div>
    </aside>
  )
}

