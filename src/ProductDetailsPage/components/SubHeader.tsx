export default function SubHeader() {
  const tabs = ['My Products', 'My Applications', 'All Products']
  
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex gap-6">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`text-sm pb-2 border-b-2 transition-colors ${
              index === 2
                ? 'text-blue-600 border-blue-600 font-medium'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
