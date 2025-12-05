import Tag from './shared/Tag'

export default function ProductHeader() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText('3080')
  }

  return (
    <div className="mb-6">
      {/* Title Row */}
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-2xl font-bold text-gray-900 font-['Bogle',sans-serif]">GTP - Clipper</h1>
        <Tag variant="green">Active</Tag>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-sm text-xs text-gray-600 font-['Bogle',sans-serif]">
          <span>ID: 3080</span>
          <button 
            type="button" 
            onClick={copyToClipboard}
            className="cursor-pointer hover:text-gray-800 transition-colors"
            title="Copy ID"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1"/>
              <path d="M4 4V3a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H8" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed font-['Bogle',sans-serif]">
        Clipper is a comprehensive custom platform designed to streamline processes across portfolio planning and management. 
        The core vision of Clipper is to create a seamless journey from strategic planning to tangible outcomes, all while 
        ensuring our processes are as lean and efficient as possible.
      </p>
    </div>
  )
}

