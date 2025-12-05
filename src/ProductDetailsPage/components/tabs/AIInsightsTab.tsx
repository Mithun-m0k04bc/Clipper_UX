import { useState } from 'react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface InsightCard {
  id: string
  category: 'wins' | 'risks' | 'actions' | 'trends'
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  source: string
}

const insights: InsightCard[] = [
  {
    id: '1',
    category: 'wins',
    title: 'Strong User Engagement Growth',
    content: 'DAU increased by 8.2% over the last 30 days, outpacing the industry average of 3.5%. User retention has improved to 89%, indicating strong product-market fit.',
    priority: 'high',
    source: 'Looker Analytics'
  },
  {
    id: '2',
    category: 'wins',
    title: 'Platform Stability Achieved',
    content: '99.9% uptime maintained for 90 consecutive days. Zero P1 incidents recorded this quarter.',
    priority: 'medium',
    source: 'Datadog'
  },
  {
    id: '3',
    category: 'risks',
    title: 'Budget Overrun Alert',
    content: 'Operational costs exceeded budget by 39% ($47K/month). Cloud compute utilization at 78% and storage at 85% are the primary drivers.',
    priority: 'high',
    source: 'FinOps Dashboard'
  },
  {
    id: '4',
    category: 'risks',
    title: 'Headcount Variance',
    content: 'Team headcount increased by +18 net additions beyond the planned 152. This impacts budget forecasts for Q1 2025.',
    priority: 'medium',
    source: 'Workday'
  },
  {
    id: '5',
    category: 'actions',
    title: 'Optimize Cloud Resources',
    content: 'Implement auto-scaling policies and reserved instances to reduce cloud spend by an estimated 25%.',
    priority: 'high',
    source: 'AI Recommendation'
  },
  {
    id: '6',
    category: 'actions',
    title: 'Review Contractor Ratios',
    content: 'Current FTE to contractor ratio is 2.5:1. Industry benchmark suggests 3:1 for cost optimization.',
    priority: 'medium',
    source: 'AI Recommendation'
  },
  {
    id: '7',
    category: 'trends',
    title: 'Feature Adoption Trending Up',
    content: 'Analytics feature usage increased 45% month-over-month. Consider investing in advanced analytics capabilities.',
    priority: 'medium',
    source: 'Product Analytics'
  },
]

const suggestedPrompts = [
  'Analyze the impact of budget overruns on Q1 planning',
  'Create a cost optimization plan for cloud resources',
  'Compare our metrics to industry benchmarks',
  'Identify at-risk OKRs and suggest mitigation strategies',
  'Generate a weekly executive summary',
]

function InsightCardComponent({ insight }: { insight: InsightCard }) {
  const categoryStyles = {
    wins: { bg: 'bg-green-50', border: 'border-green-200', icon: '🏆', iconBg: 'bg-green-100' },
    risks: { bg: 'bg-red-50', border: 'border-red-200', icon: '⚠️', iconBg: 'bg-red-100' },
    actions: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '📋', iconBg: 'bg-blue-100' },
    trends: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '📈', iconBg: 'bg-purple-100' },
  }

  const priorityStyles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  }

  const style = categoryStyles[insight.category]

  return (
    <div className={`${style.bg} ${style.border} border rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${style.iconBg} rounded-lg flex items-center justify-center text-xl`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{insight.title}</h4>
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${priorityStyles[insight.priority]}`}>
              {insight.priority.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{insight.content}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Source: {insight.source}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        message.type === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <span className={`text-xs mt-1 block ${
          message.type === 'user' ? 'text-blue-200' : 'text-gray-400'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default function AIInsightsTab() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm Wibey, your AI assistant for GTP - Clipper. I can help you analyze data, generate reports, and provide insights. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const categories = [
    { id: 'all', label: 'All Insights', count: insights.length },
    { id: 'wins', label: 'Wins', count: insights.filter(i => i.category === 'wins').length },
    { id: 'risks', label: 'Risks', count: insights.filter(i => i.category === 'risks').length },
    { id: 'actions', label: 'Actions', count: insights.filter(i => i.category === 'actions').length },
    { id: 'trends', label: 'Trends', count: insights.filter(i => i.category === 'trends').length },
  ]

  const filteredInsights = activeCategory === 'all' 
    ? insights 
    : insights.filter(i => i.category === activeCategory)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm analyzing the data related to your question. Based on the current metrics and trends, I can see several interesting patterns. Let me provide you with a detailed breakdown...",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.5 7.5H22l-6 5 2.5 7.5L12 17l-6.5 5 2.5-7.5-6-5h7.5L12 2z" fill="#7B61FF"/>
            </svg>
            AI Insights
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-600 rounded">BETA</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">AI-powered insights and recommendations for your product</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Insights Section */}
        <div className="col-span-2 space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeCategory === cat.id ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Insights Grid */}
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <InsightCardComponent key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l1.5 4.5H14l-3.5 3 1.5 4.5L8 10l-4 3 1.5-4.5L2 5.5h4.5L8 1z" fill="#7B61FF"/>
                </svg>
              </div>
              Ask Wibey
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(prompt)}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything about your product..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

