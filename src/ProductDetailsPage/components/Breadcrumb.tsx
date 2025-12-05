import { IconOrg, IconSubOrg, IconSubPillar, IconProduct } from './shared/CustomIcons'

export default function Breadcrumb() {
  return (
    <div className="flex items-center justify-between mb-6">
      <nav className="flex items-center gap-2 text-sm font-['Bogle',sans-serif]">
        <div className="flex items-center gap-1.5">
          <IconOrg />
          <span className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">Global Tech</span>
        </div>
        <span className="text-gray-400">/</span>
        <div className="flex items-center gap-1.5">
          <IconSubOrg />
          <span className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">Technology Platform</span>
        </div>
        <span className="text-gray-400">/</span>
        <div className="flex items-center gap-1.5">
          <IconSubPillar />
          <span className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">Developer Productivity</span>
        </div>
        <span className="text-gray-400">/</span>
        <div className="flex items-center gap-1.5">
          <IconProduct />
          <span className="text-blue-600 font-medium">GTP - Clipper</span>
        </div>
      </nav>
      <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-['Bogle',sans-serif] transition-colors">
        More Details
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

