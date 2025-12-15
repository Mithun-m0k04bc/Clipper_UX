import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePDLC } from './context/PDLCContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actionButtons?: { label: string; action: string; primary?: boolean }[]
}

interface CanvasItem {
  id: string
  type: 'problem-statement' | 'insight' | 'journey' | 'persona' | 'requirement' | 'signal' | 'theme'
  content: string
  position: { x: number; y: number }
  section?: 'signals' | 'themes' | 'problems' | 'insights' | 'journeys' | 'personas'
}

type ClarificationState = 'initial' | 'parsing-signals' | 'asking-questions' | 'theme-locked' | 'working-on-canvas'

export default function WibeyWorkspace() {
  const navigate = useNavigate()
  const { currentWorkspace, updateWorkspace, saveWorkspace, updatePDLCData } = usePDLC()
  const [clarificationState, setClarificationState] = useState<ClarificationState>('initial')
  const [themeLocked, setThemeLocked] = useState(false)
  const [_signals, setSignals] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [questionsAsked, setQuestionsAsked] = useState(0)

  // Initialize messages based on workspace state
  const getInitialMessage = (): Message => {
    if (currentWorkspace?.theme) {
      return {
        id: '1',
        role: 'assistant',
        content: `Welcome back to "${currentWorkspace.name}"! I see we've locked in on the theme: "${currentWorkspace.theme}". Let's continue working through the Canvas sections.`,
        timestamp: new Date(),
      }
    }
    return {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Wibey, your AI thinking partner. Let's start by sharing your initial prompt or idea. What problem are you trying to solve, or what opportunity do you see?\n\nYou can paste links to documents, describe the situation, or share any signals you've collected.",
      timestamp: new Date(),
    }
  }

  const [messages, setMessages] = useState<Message[]>([])
  
  const [input, setInput] = useState('')
  const [showCanvas, setShowCanvas] = useState(true)
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [activeSection, setActiveSection] = useState<'signals' | 'themes' | 'problems' | 'insights' | 'journeys' | 'personas'>('signals')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Redirect if no workspace selected and initialize messages
  useEffect(() => {
    if (!currentWorkspace) {
      navigate('/pdlc')
      return
    }
    
    // Initialize messages when workspace is loaded (only once)
    setMessages([getInitialMessage()])
    
    // Load workspace state
    if (currentWorkspace.theme) {
      setThemeLocked(true)
      setClarificationState('theme-locked')
    }
    if (currentWorkspace.pdlcData?.signals) {
      const allSignals = [
        ...currentWorkspace.pdlcData.signals.prds,
        ...currentWorkspace.pdlcData.signals.jiraTickets,
        ...currentWorkspace.pdlcData.signals.slackThreads,
      ]
      setSignals(allSignals)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace?.id, navigate])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = input
    setInput('')
    setIsTyping(true)

    // Process based on clarification state
    setTimeout(() => {
      if (clarificationState === 'initial') {
        handleInitialPrompt(userInput)
      } else if (clarificationState === 'parsing-signals') {
        handleSignalParsing(userInput)
      } else if (clarificationState === 'asking-questions') {
        handleClarificationQuestion(userInput)
      } else {
        handleGeneralConversation(userInput)
      }
      setIsTyping(false)
    }, 1500)
  }

  const handleInitialPrompt = (userInput: string) => {
    // Extract signals from initial prompt
    const extractedSignals = extractSignals(userInput)
    setSignals(prev => [...prev, ...extractedSignals])
    
    // Add signals to canvas
    extractedSignals.forEach(signal => {
      addToCanvas('signal', signal, 'signals')
    })

    // Move to parsing signals state
    setClarificationState('parsing-signals')
    
    const response = `Thanks for sharing! I've identified ${extractedSignals.length} key signal${extractedSignals.length !== 1 ? 's' : ''} from your input. Let me parse through these and identify themes...`
    
    setTimeout(() => {
      const themes = identifyThemes(extractedSignals)
      setThemes(themes)
      themes.forEach(theme => {
        addToCanvas('theme', theme, 'themes')
      })
      
      setClarificationState('asking-questions')
      const questionResponse = `I've identified ${themes.length} potential theme${themes.length !== 1 ? 's' : ''}:\n\n${themes.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nTo help me lock-in on the right theme, I have a few clarifying questions:\n\n${generateClarificationQuestion(themes)}`
      
      addMessage('assistant', questionResponse)
      setQuestionsAsked(1)
    }, 2000)
    
    addMessage('assistant', response)
  }

  const handleSignalParsing = (userInput: string) => {
    const extractedSignals = extractSignals(userInput)
    setSignals(prev => [...prev, ...extractedSignals])
    extractedSignals.forEach(signal => {
      addToCanvas('signal', signal, 'signals')
    })
    addMessage('assistant', `Added ${extractedSignals.length} more signal${extractedSignals.length !== 1 ? 's' : ''}. Continue sharing signals, or say "done" when you're ready to move forward.`)
  }

  const handleClarificationQuestion = (_userInput: string) => {
    const questions = [
      "Which theme resonates most with your primary goal?",
      "What's the most critical problem you're trying to solve?",
      "Who is the primary user or customer segment you're targeting?",
      "What's the expected business impact or outcome?",
    ]
    
    if (questionsAsked < questions.length) {
      setQuestionsAsked(prev => prev + 1)
      addMessage('assistant', questions[questionsAsked])
    } else {
      // Lock in theme
      const lockedTheme = themes[0] || "Product Enhancement"
      setThemeLocked(true)
      setClarificationState('theme-locked')
      
      if (currentWorkspace) {
        updateWorkspace(currentWorkspace.id, { theme: lockedTheme })
      }
      
      addMessage('assistant', `Perfect! I'm locking in on the theme: **${lockedTheme}**\n\nNow let's work through the different sections in the Canvas. You can explore:\n• Problem statements\n• User insights\n• Journey maps\n• Personas\n\nWhich section would you like to start with?`, [
        { label: 'Problem Statements', action: 'section-problems', primary: true },
        { label: 'User Insights', action: 'section-insights', primary: false },
        { label: 'Journey Maps', action: 'section-journeys', primary: false },
      ])
    }
  }

  const handleGeneralConversation = (userInput: string) => {
    const response = generateAIResponse(userInput)
    addMessage('assistant', response)
    
    // Auto-extract insights to canvas
    if (userInput.toLowerCase().includes('problem') || userInput.toLowerCase().includes('issue')) {
      addToCanvas('problem-statement', userInput, 'problems')
    } else if (userInput.toLowerCase().includes('user') || userInput.toLowerCase().includes('customer')) {
      addToCanvas('insight', userInput, 'insights')
    }
  }

  const addMessage = (role: 'user' | 'assistant', content: string, actionButtons?: { label: string; action: string; primary?: boolean }[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      actionButtons,
    }])
  }

  const handleAction = (action: string) => {
    if (action.startsWith('section-')) {
      const section = action.replace('section-', '') as CanvasItem['section']
      setActiveSection(section || 'signals')
      addMessage('assistant', `Great! Let's work on ${section}. What would you like to explore here?`)
    }
  }

  const extractSignals = (input: string): string[] => {
    const signals: string[] = []
    // Extract URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urls = input.match(urlRegex)
    if (urls) signals.push(...urls)
    
    // Extract key phrases (simple heuristic)
    const phrases = input.split(/[.!?]/).filter(p => p.trim().length > 20)
    signals.push(...phrases.slice(0, 3))
    
    return signals.length > 0 ? signals : [input]
  }

  const identifyThemes = (signals: string[]): string[] => {
    const themes: string[] = []
    const lowerSignals = signals.join(' ').toLowerCase()
    
    if (lowerSignals.includes('checkout') || lowerSignals.includes('payment') || lowerSignals.includes('cart')) {
      themes.push('Checkout Optimization')
    }
    if (lowerSignals.includes('mobile') || lowerSignals.includes('app')) {
      themes.push('Mobile Experience Enhancement')
    }
    if (lowerSignals.includes('performance') || lowerSignals.includes('speed') || lowerSignals.includes('latency')) {
      themes.push('Performance Improvement')
    }
    if (lowerSignals.includes('user') || lowerSignals.includes('customer') || lowerSignals.includes('experience')) {
      themes.push('User Experience Enhancement')
    }
    
    return themes.length > 0 ? themes : ['Product Enhancement']
  }

  const generateClarificationQuestion = (_themes: string[]): string => {
    return "1. Which theme aligns most closely with your primary objective?\n2. What's the most critical problem you're trying to solve?\n3. Who is your primary target user or customer segment?"
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('checkout') || lowerInput.includes('payment')) {
      return "Interesting! Checkout optimization is a critical area. I'm detecting a few themes here:\n\n• Cart abandonment reduction\n• Payment friction\n• User trust and security\n\nCan you tell me more about the current pain points? What feedback have you received from users?"
    } else if (lowerInput.includes('mobile') || lowerInput.includes('app')) {
      return "Mobile experience is crucial! I'm seeing potential areas to explore:\n\n• Performance and load times\n• Touch interactions\n• Offline capabilities\n\nWhat specific mobile challenges are your users facing?"
    } else if (lowerInput.includes('data') || lowerInput.includes('analytics')) {
      return "Analytics and data insights - great! Let me help you think through this:\n\n• What decisions need to be data-driven?\n• Who are the key stakeholders?\n• What metrics matter most?\n\nLet's start mapping out the data flows and requirements."
    } else {
      return "That's a great starting point! Let me help you explore this further. I'm synthesizing what you've shared...\n\n• I can help identify key themes\n• Extract problem statements\n• Map user needs\n• Define success metrics\n\nWhat aspect would you like to dive deeper into first?"
    }
  }

  const addToCanvas = (type: CanvasItem['type'], content: string, section?: CanvasItem['section']) => {
    const newItem: CanvasItem = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 },
      section: section || 'signals',
    }
    setCanvasItems(prev => [...prev, newItem])
    setShowCanvas(true)
    
    // Update PDLC data
    if (section === 'signals' && currentWorkspace) {
      updatePDLCData({
        signals: {
          ...currentWorkspace.pdlcData?.signals || {
            prds: [],
            jiraTickets: [],
            slackThreads: [],
            analytics: [],
            incidents: [],
            otherInputs: [],
          },
          otherInputs: [...(currentWorkspace.pdlcData?.signals?.otherInputs || []), content],
        },
      })
    }
    
    // Auto-save workspace
    setTimeout(() => {
      saveWorkspace()
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getItemColor = (type: CanvasItem['type']) => {
    switch (type) {
      case 'problem-statement': return 'bg-red-50 border-red-200 text-red-900'
      case 'insight': return 'bg-blue-50 border-blue-200 text-blue-900'
      case 'journey': return 'bg-purple-50 border-purple-200 text-purple-900'
      case 'persona': return 'bg-green-50 border-green-200 text-green-900'
      case 'requirement': return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      default: return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Chat */}
      <div className="w-[45%] border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                saveWorkspace()
                navigate('/pdlc')
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentWorkspace?.name || 'Wibey Thinking Workspace'}
            </h1>
            {themeLocked && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Theme: {currentWorkspace?.theme}
              </span>
            )}
          </div>
          <button 
            onClick={saveWorkspace}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Save Draft
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {message.role === 'assistant' ? '🤖' : 'You'}
                </div>
                
                {/* Message bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  {message.actionButtons && message.actionButtons.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actionButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(btn.action)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            btn.primary
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-xs opacity-60 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
                <div className="rounded-2xl px-4 py-3 bg-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowCanvas(!showCanvas)}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 flex items-center gap-2"
              title="Toggle Canvas"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Canvas
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your question here... (Shift + Return to add new line)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            AI-generated responses may be inaccurate and should be validated.
          </p>
        </div>
      </div>

      {/* Right Panel - Canvas/Document */}
      <div className="flex-1 bg-gray-50 overflow-hidden">
        {showCanvas ? (
          <div className="h-full flex flex-col">
            {/* Canvas Header */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Thinking Canvas</h2>
                <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
                  {(['signals', 'themes', 'problems', 'insights', 'journeys', 'personas'] as const).map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        activeSection === section
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  Export
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  Share
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-6 overflow-auto relative">
              {canvasItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Thinking Canvas</h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    As you chat with Wibey, insights, problem statements, and key concepts will automatically appear here. 
                    You can drag and organize them visually.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {canvasItems
                    .filter(item => !item.section || item.section === activeSection)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 ${getItemColor(item.type)} shadow-sm hover:shadow-md transition-shadow cursor-move`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
                            {item.type.replace('-', ' ')}
                          </span>
                          <button 
                            onClick={() => setCanvasItems(prev => prev.filter(i => i.id !== item.id))}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  {canvasItems.filter(item => !item.section || item.section === activeSection).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No items in {activeSection} section yet. Start chatting with Wibey to add items here!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Document Header */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
              <h2 className="text-lg font-semibold text-gray-900">Unified PDLC Overview</h2>
              <button 
                onClick={() => setShowCanvas(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Open Canvas
              </button>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Unified PDLC Proposal Overview</h1>
                
                <p className="text-gray-700 leading-relaxed mb-8">
                  This document outlines the proposal for a unified Product Development Lifecycle (PDLC), integrating the 
                  methodologies and tools of SDD (Structured Design & Development), AIDLC (AI-Driven Lifecycle), and Wibey 
                  (a thinking workspace/tool). The primary objective is to streamline and automate the product development 
                  process for product managers (PMs), engineers, and leadership, fostering efficiency, structure, and transparency.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Phases and Concepts</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Capture & Curate Signals (Wibey Workspace)</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>PMs collect all pertinent inputs (PRDs, Jira, Slack, analytics, incidents, etc.) into a centralized workspace.</li>
                      <li>AI tools facilitate extraction of essential ideas, theme identification, dependency mapping, and gap detection.</li>
                      <li>The system synthesizes raw data into structured insights: problem statements, jobs-to-be-done, user journeys, and more.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Discovery & Conceptualization</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>AI guides PMs as they refine insights into personas, process flows, risks, and desired business outcomes.</li>
                      <li>AI-enabled consistency checks guarantee completeness and clarity prior to phase progression.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Specification / Design (SDD)</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>One-click generation of a machine-readable, SpecKit-compatible specification.</li>
                      <li>The specification serves as a contract between PM and Engineering to enable safe automation.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Design (GenMap, MagicScreen, AskGlass, TechDesignCoach)</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>AI agents auto-generate UI/UX skeletons, dependency graphs, and provide technical answers.</li>
                      <li>Design decisions are anchored in existing knowledge and standards.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Plan</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Automated planning, including dependency resolution, sequencing, risk evaluation, and readiness assessment.</li>
                      <li>Ensures all necessary inputs are available for the build phase.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Build / Execute (AIDLC Automation)</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Automated code and test generation based on the spec.</li>
                      <li>Developers can modify, approve, and maintain traceability to the original specification.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


