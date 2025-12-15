import { useState, useRef, useEffect } from 'react'
import { usePDLC } from './context/PDLCContext'
import WibeyLogo from '../assets/wibey-logo.svg'


interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  actionButtons?: { label: string; action: string; primary?: boolean; description?: string }[]
}

interface SourceConnection {
  id: string
  type: 'slack' | 'jira' | 'confluence' | 'onedrive' | 'adobe-analytics'
  name: string
  description: string
  connected: boolean
  connectedAt?: string
}

// Example workspaces - defined outside component to prevent recreation on every render
const EXAMPLE_WORKSPACES = [
  {
    id: 'example-1',
    name: 'Seller Verification Optimization',
    description: 'Improving seller onboarding process',
    lastStage: 'capture' as const,
    status: 'In Progress' as const,
    signalCount: 847,
    progress: 0.68,
    progressColor: 'yellow' as const,
    lastModified: '2024-12-15T10:00:00Z', // Static date for demo
    owner: 'Sarah Johnson',
    hasData: true,
  },
  {
    id: 'example-2',
    name: 'Mobile App Performance',
    description: 'Enhancing app speed and responsiveness',
    lastStage: 'discovery' as const,
    status: 'In Progress' as const,
    signalCount: 342,
    progress: 0.45,
    progressColor: 'red' as const,
    lastModified: '2024-12-15T07:00:00Z', // Static date for demo
    owner: 'Mike Chen',
    hasData: true,
  },
  {
    id: 'example-3',
    name: 'Payment Reconciliation',
    description: 'Streamlining payment processing',
    lastStage: 'specification' as const,
    status: 'Review' as const,
    signalCount: 523,
    progress: 0.89,
    progressColor: 'green' as const,
    lastModified: '2024-12-14T12:00:00Z', // Static date for demo
    owner: 'Emily Rodriguez',
    hasData: true,
  },
]

export default function UnifiedWorkspace() {
  const {
    workspaces,
    currentWorkspace,
    createWorkspace,
    selectWorkspace,
    updateWorkspace,
    saveWorkspace
  } = usePDLC()

  const exampleWorkspaces = EXAMPLE_WORKSPACES

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `about ${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'just now'
  }

  const getProgressColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600'
      case 'yellow': return 'text-yellow-600'
      case 'red': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const [prdSections, setPrdSections] = useState([
    { id: 'overview', title: 'Executive Summary', content: 'This PRD outlines the requirements for improving customer checkout experience...', editable: false },
    { id: 'problem', title: 'Problem Statement', content: 'Current checkout flow has a 68% abandonment rate on mobile devices...', editable: false },
    { id: 'goals', title: 'Goals & Success Metrics', content: 'Target: Reduce cart abandonment from 68% to 40%\nTimeline: 6 weeks\nMarkets: IN, CA, MX', editable: false },
    { id: 'personas', title: 'User Personas & Journeys', content: 'Primary persona: Mobile-first shoppers in IN, CA, MX markets...', editable: false },
    { id: 'functional', title: 'Functional Requirements', content: '1. Reduce payment timeout from 2.8s to <1.5s\n2. Add promo code fallback UI\n3. Support Hindi error messages...', editable: false },
    { id: 'non-functional', title: 'Non-Functional Requirements', content: 'Performance: Payment API must respond within 1.5s (95th percentile)...', editable: false },
    { id: 'api', title: 'API Contracts & Dependencies', content: 'Payment Service API v4\nPromo Code Service API\nLocalization Service...', editable: false },
    { id: 'feature-flags', title: 'Feature Flags & Rollout', content: 'Feature flag: checkout_optimization_v2\nRollout: 10% → 50% → 100% over 2 weeks...', editable: false },
    { id: 'risks', title: 'Risks & Mitigation', content: 'Risk: Payment API migration may cause temporary downtime\nMitigation: Gradual rollout with feature flags...', editable: false },
    { id: 'out-of-scope', title: 'Out of Scope', content: 'Desktop checkout optimization\nNew payment gateway integration...', editable: false },
  ])

  const [editingPrdSection, setEditingPrdSection] = useState<string | null>(null)
  const [selectedPrdSection, setSelectedPrdSection] = useState<string>('overview')

  const [selectedExampleWorkspace, setSelectedExampleWorkspace] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('')
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false)
  const [editWorkspaceName, setEditWorkspaceName] = useState('')
  const [editWorkspaceDescription, setEditWorkspaceDescription] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'Editor' | 'Viewer'>('Editor')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initializedWorkspaceRef = useRef<string | null>(null) // Track which workspace has been initialized
  const dataLoadedWorkspaceRef = useRef<string | null>(null) // Track which workspace has data loaded

  const [sources, setSources] = useState<SourceConnection[]>([
    { id: 'slack', type: 'slack', name: 'Slack', description: 'Connect Slack channels', connected: false },
    { id: 'jira', type: 'jira', name: 'Jira', description: 'Connect Jira projects', connected: false },
    { id: 'confluence', type: 'confluence', name: 'Confluence', description: 'Connect Confluence spaces', connected: false },
    { id: 'onedrive', type: 'onedrive', name: 'OneDrive', description: 'Enterprise file storage', connected: true, connectedAt: '2024-01-15' },
    { id: 'adobe-analytics', type: 'adobe-analytics', name: 'Adobe Analytics', description: 'Web analytics data', connected: true, connectedAt: '2024-01-10' },
  ])

  const [signalAnalysis, setSignalAnalysis] = useState({
    totalSignals: 0,
    keyThemes: 0,
    insights: 0,
    themes: [] as Array<{ name: string; signals: number; priority: string; status: string }>,
    analyzed: false,
  })

  const [hypothesis, setHypothesis] = useState({
    problemStatement: '',
    hypothesis: '',
    themeLocked: false,
    selectedTheme: null as string | null,
  })

  const [teamMembers] = useState([
    { id: '1', name: 'Sarah Johnson', role: 'Product Manager', initials: 'SJ', color: 'blue' },
    { id: '2', name: 'Mike Chen', role: 'Engineering Lead', initials: 'MC', color: 'purple' },
  ])

  // Mock shared members count for workspaces
  const getWorkspaceMembers = (workspaceId: string) => {
    // Return member count for demo
    const counts: Record<string, number> = {
      'example-1': 3,
      'example-2': 2,
      'example-3': 5,
    }
    return counts[workspaceId] || Math.floor(Math.random() * 5) + 1
  }

  const [handoffStatus, setHandoffStatus] = useState([
    { id: '1', name: 'PRD Review', status: 'completed', description: 'Completed' },
    { id: '2', name: 'Engineering Handoff', status: 'in-progress', description: 'In Progress' },
    { id: '3', name: 'Design Review', status: 'pending', description: 'Pending' },
  ])

  // Load workspace data when currentWorkspace changes
  useEffect(() => {
    if (!currentWorkspace) {
      dataLoadedWorkspaceRef.current = null
      return
    }

    // Only load data once per workspace
    if (dataLoadedWorkspaceRef.current === currentWorkspace.id) {
      return // Already loaded this workspace
    }

    // Check if this is an example workspace
    const exampleWorkspace = exampleWorkspaces.find(w =>
      w.name === currentWorkspace.name &&
      w.description === currentWorkspace.description
    )

    if (exampleWorkspace && exampleWorkspace.hasData) {
      // Mark as loaded immediately to prevent re-runs
      dataLoadedWorkspaceRef.current = currentWorkspace.id
      
      // Small delay to ensure workspace state is updated
      const timer = setTimeout(() => {
        // Reset state first
        setSignalAnalysis({
          totalSignals: 0,
          keyThemes: 0,
          insights: 0,
          themes: [],
          analyzed: false,
        })
        setHypothesis({
          problemStatement: '',
          hypothesis: '',
          themeLocked: false,
          selectedTheme: null,
        })
        setPrdSections([])

        // Load data based on the workspace's actual stage
        const stageToUse = currentWorkspace.lastStage || exampleWorkspace.lastStage
        loadWorkspaceData(stageToUse)
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [currentWorkspace?.id]) // Only depend on workspace ID to avoid loops

  // Initialize messages based on whether workspace is selected - only once per workspace
  useEffect(() => {
    // Only initialize if we haven't already initialized this workspace
    if (currentWorkspace && initializedWorkspaceRef.current !== currentWorkspace.id) {
      initializedWorkspaceRef.current = currentWorkspace.id
      const welcomeMessage = getWelcomeMessageForStage(currentWorkspace.lastStage)
      setMessages([welcomeMessage])
    } else if (!currentWorkspace) {
      initializedWorkspaceRef.current = null
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hi! I'm Wibey, your AI partner for the Product Development Lifecycle.\n\nI help transform scattered signals into shipped features with full traceability.\n\nSelect a workspace to get started, or create a new one!",
        timestamp: new Date(),
      }])
    }
  }, [currentWorkspace?.id]) // Only depend on workspace ID

  // Disable proactive suggestions - they were causing infinite loops
  // Users can use the quick actions instead

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getWelcomeMessageForStage = (stage: string): Message => {
    // Check if workspace has data already
    const hasData = signalAnalysis.totalSignals > 0 || hypothesis.themeLocked || prdSections.length > 0

    const stageMessages: Record<string, string> = {
      'wibey': `Welcome to "${currentWorkspace?.name}"! I'm here to help you transform product signals into a complete PRD.\n\n**Current Status:** Ready to start\n**Next Step:** Connect your data sources to begin capturing signals`,
      'capture': hasData
        ? `Welcome back to "${currentWorkspace?.name}"! You're in the **Capture** stage.\n\n**Current Status:** ${signalAnalysis.totalSignals > 0 ? `${signalAnalysis.totalSignals} signals captured` : 'Ready to capture signals'}\n**Next Step:** ${signalAnalysis.analyzed ? 'Review themes and form hypothesis' : 'Start ingesting signals from connected sources'}`
        : `Welcome to "${currentWorkspace?.name}"! You're in the **Capture** stage.\n\n**What to do:**\n1. Connect your data sources (Slack, Jira, Confluence)\n2. Start ingesting signals\n3. I'll analyze and identify key themes\n\n**Current Status:** Ready to connect sources`,
      'discovery': hasData
        ? `Welcome back to "${currentWorkspace?.name}"! You're in the **Discovery** stage.\n\n**Current Status:** ${hypothesis.themeLocked ? 'Theme selected, hypothesis formed' : 'Themes identified, ready to form hypothesis'}\n**Next Step:** ${hypothesis.themeLocked ? 'Generate PRD from hypothesis' : 'Select a theme and form your hypothesis'}`
        : `Welcome to "${currentWorkspace?.name}"! You're in the **Discovery** stage.\n\n**What to do:**\n1. Review identified themes from signals\n2. Select a theme to focus on\n3. Form problem statement and hypothesis\n\n**Current Status:** Ready to explore themes`,
      'specification': `Welcome back to "${currentWorkspace?.name}"! You're in the **Specification** stage.\n\n**Current Status:** ${prdSections.length > 0 ? 'PRD generated' : 'Ready to generate PRD'}\n**Next Step:** ${prdSections.length > 0 ? 'Review and refine PRD sections' : 'Generate comprehensive PRD from hypothesis'}`,
      'design': `Welcome back to "${currentWorkspace?.name}"! You're in the **Design** stage.\n\n**Current Status:** PRD complete, ready for design\n**Next Step:** Generate UI/UX skeletons and technical designs`,
      'plan': `Welcome back to "${currentWorkspace?.name}"! You're in the **Plan** stage.\n\n**Current Status:** Design complete, ready to plan\n**Next Step:** Create detailed project plan with tasks and timelines`,
      'build': `Welcome back to "${currentWorkspace?.name}"! You're in the **Build** stage.\n\n**Current Status:** Plan complete, ready to execute\n**Next Step:** Generate code and execute the build`,
      'trace': `Welcome back to "${currentWorkspace?.name}"! You're in the **Trace** stage.\n\n**Current Status:** Build complete\n**Next Step:** Review audit trail and verify traceability`,
      'feedback': `Welcome back to "${currentWorkspace?.name}"! You're in the **Feedback** stage.\n\n**Current Status:** Implementation complete\n**Next Step:** Analyze outcomes and plan improvements`,
    }

    const quickActions = getQuickActionsForStage(stage, hasData)

    return {
      id: '1',
      role: 'assistant',
      content: stageMessages[stage] || `Welcome back to "${currentWorkspace?.name}"!`,
      timestamp: new Date(),
      actionButtons: quickActions,
    }
  }

  const getQuickActionsForStage = (stage: string, hasData: boolean = false) => {
    const actions: Record<string, { label: string; action: string; primary?: boolean; description?: string }[]> = {
      'wibey': [
        {
          label: '🔗 Connect Data Sources',
          action: 'connect-sources',
          primary: true,
          description: 'Connect Slack, Jira, Confluence to automatically capture product signals'
        },
        {
          label: '📤 Upload Documents',
          action: 'upload-docs',
          primary: false,
          description: 'Upload PRDs, research docs, or meeting notes to get started'
        },
        {
          label: '💡 Share Your Idea',
          action: 'share-prompt',
          primary: false,
          description: 'Tell me about the problem you want to solve'
        },
      ],
      'capture': hasData ? [
        {
          label: '📊 Review Signal Analysis',
          action: 'review-signals',
          primary: true,
          description: 'View analyzed themes and insights from captured signals'
        },
        {
          label: '🎯 Form Hypothesis',
          action: 'form-hypothesis',
          primary: false,
          description: 'Select a theme and define problem statement'
        },
        {
          label: '📋 Generate PRD',
          action: 'generate-prd',
          primary: false,
          description: 'Create PRD from your hypothesis'
        },
      ] : [
        {
          label: '🔗 Connect Sources First',
          action: 'connect-sources',
          primary: true,
          description: 'Connect at least one source before ingesting'
        },
        {
          label: '🚀 Start Ingestion',
          action: 'start-ingesting',
          primary: false,
          description: 'Begin capturing signals from connected sources'
        },
        {
          label: '📤 Upload Files',
          action: 'upload-docs',
          primary: false,
          description: 'Upload documents to process'
        },
      ],
      'discovery': [
        {
          label: '👤 Create User Personas',
          action: 'create-personas',
          primary: true,
          description: 'Define target users and their needs based on signals'
        },
        {
          label: '🗺️ Map User Journeys',
          action: 'map-journeys',
          primary: false,
          description: 'Visualize user flows and pain points'
        },
        {
          label: '🎯 Define Problem Statement',
          action: 'define-problem',
          primary: false,
          description: 'Clarify the core problem to solve'
        },
      ],
      'specification': [
        {
          label: '📋 Generate Specification',
          action: 'generate-spec',
          primary: true,
          description: 'Create detailed functional and technical specs'
        },
        {
          label: '✅ Define Acceptance Criteria',
          action: 'define-criteria',
          primary: false,
          description: 'Set clear success metrics and test criteria'
        },
        {
          label: '🔗 Map Dependencies',
          action: 'map-dependencies',
          primary: false,
          description: 'Identify technical and product dependencies'
        },
      ],
      'design': [
        {
          label: '🎨 Generate Design Mockups',
          action: 'generate-design',
          primary: true,
          description: 'Create UI/UX designs based on specifications'
        },
        {
          label: '📐 Create Design System',
          action: 'create-design-system',
          primary: false,
          description: 'Build reusable components and patterns'
        },
        {
          label: '📱 Prototype Flows',
          action: 'prototype-flows',
          primary: false,
          description: 'Create interactive prototypes for testing'
        },
      ],
      'plan': [
        {
          label: '📅 Create Project Plan',
          action: 'create-plan',
          primary: true,
          description: 'Break down work into tasks with timelines'
        },
        {
          label: '👥 Assign Team Members',
          action: 'assign-team',
          primary: false,
          description: 'Allocate work to team members'
        },
        {
          label: '📊 Estimate Effort',
          action: 'estimate-effort',
          primary: false,
          description: 'Calculate time and resource requirements'
        },
      ],
      'build': [
        {
          label: '🔨 Generate Code',
          action: 'execute-build',
          primary: true,
          description: 'Generate implementation code from specs'
        },
        {
          label: '🧪 Create Tests',
          action: 'run-tests',
          primary: false,
          description: 'Generate unit and integration tests'
        },
        {
          label: '📝 Write Documentation',
          action: 'write-docs',
          primary: false,
          description: 'Create API and user documentation'
        },
      ],
      'trace': [
        {
          label: '📊 View Audit Trail',
          action: 'view-audit',
          primary: true,
          description: 'See complete history from idea to code'
        },
        {
          label: '🔍 Verify Traceability',
          action: 'check-traceability',
          primary: false,
          description: 'Ensure all requirements are implemented'
        },
        {
          label: '📈 Generate Report',
          action: 'generate-report',
          primary: false,
          description: 'Create traceability report for stakeholders'
        },
      ],
      'feedback': [
        {
          label: '📈 Analyze Outcomes',
          action: 'analyze-outcomes',
          primary: true,
          description: 'Measure success metrics and user feedback'
        },
        {
          label: '💡 Plan Improvements',
          action: 'plan-improvements',
          primary: false,
          description: 'Identify areas for enhancement'
        },
        {
          label: '🔄 Start Next Iteration',
          action: 'next-iteration',
          primary: false,
          description: 'Begin a new cycle with lessons learned'
        },
      ],
    }
    return actions[stage] || []
  }

  const getNextActionSuggestion = (stage: string): string => {
    const suggestions: Record<string, string> = {
      'wibey': "💡 **Suggested next action:** Connect your data sources (Slack, Jira, Confluence) to start capturing product signals automatically.",
      'capture': "💡 **Suggested next action:** Review the captured signals and let me help identify key themes and patterns.",
      'discovery': "💡 **Suggested next action:** Define user personas and map out the customer journey to understand needs better.",
      'specification': "💡 **Suggested next action:** Generate a comprehensive specification document with requirements and acceptance criteria.",
      'design': "💡 **Suggested next action:** Create UI/UX skeletons and technical design documents.",
      'plan': "💡 **Suggested next action:** Build a detailed project plan with tasks, dependencies, and timelines.",
      'build': "💡 **Suggested next action:** Execute the build phase and generate code based on the specification.",
      'trace': "💡 **Suggested next action:** Review the audit trail to ensure full traceability from idea to code.",
      'feedback': "💡 **Suggested next action:** Analyze outcomes and identify areas for improvement in the next iteration.",
    }
    return suggestions[stage] || ''
  }

  const handleAnalyzeSignals = () => {
    if (!signalAnalysis.analyzed || signalAnalysis.themes.length === 0) {
      addMessage('assistant', '⚠️ Please start ingesting signals first. Connect your sources and click "Start Ingesting" to capture signals.')
      return
    }
    
    addMessage('assistant', `🔍 **Signal Analysis Complete**\n\nI've analyzed ${signalAnalysis.totalSignals} signals and identified ${signalAnalysis.keyThemes} key themes:\n\n${signalAnalysis.themes.map((t, i) => `${i + 1}. **${t.name}** (${t.signals} signals, ${t.status})`).join('\n')}\n\nClick on any theme in the Signal Analysis section to explore it further!`, [
      { label: '🎯 Select a Theme', action: 'form-hypothesis', primary: true, description: 'Choose a theme to form hypothesis' },
      { label: '🔍 Deep Dive', action: 'deep-dive', primary: false, description: 'Detailed signal breakdown' }
    ])
  }

  const handleFormHypothesis = (themeIndex?: number) => {
    if (!signalAnalysis.analyzed || signalAnalysis.themes.length === 0) {
      addMessage('assistant', '⚠️ Please analyze signals first before forming a hypothesis.')
      return
    }

    const themeIdx = themeIndex ?? 0
    const selectedTheme = signalAnalysis.themes[themeIdx]
    const selectedThemeId = `theme-${themeIdx}`

    // Generate hypothesis based on the selected theme - check EXACT theme first, then fallback to keywords
    const themeLower = selectedTheme.name.toLowerCase()
    let problemStatement = ''
    let hypothesisText = ''

    // Mobile App Performance specific themes
    if (themeLower.includes('app load time')) {
      problemStatement = `App load time issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience slow initial load times (avg 4.2s) and sluggish screen transitions, causing 35% of users to abandon the app before completing actions.`
      hypothesisText = 'If we optimize app initialization, implement lazy loading, and reduce bundle size by 40%, we can reduce load time to <2 seconds and decrease app abandonment by 50% within 8 weeks.'
    } else if (themeLower.includes('checkout performance')) {
      problemStatement = `Checkout flow performance issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience delays during checkout (avg 3.5s per step), payment processing lags, and UI freezes, resulting in 42% checkout abandonment.`
      hypothesisText = 'If we optimize checkout API calls, implement optimistic UI updates, and add progress indicators, we can reduce checkout time by 60% and increase conversion rates by 25% within 6 weeks.'
    } else if (themeLower.includes('crash') || themeLower.includes('error rates')) {
      problemStatement = `App stability issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience crashes (2.3% crash rate), ANR errors, and unexpected logouts, particularly on Android devices and during payment flows.`
      hypothesisText = 'If we fix critical crash patterns, implement better error boundaries, and add offline fallbacks, we can reduce crash rate to <0.5% and improve user retention by 30% within 10 weeks.'
    } else if (themeLower.includes('network timeout')) {
      problemStatement = `Network connectivity issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience timeout errors, failed API requests (15% failure rate), and inconsistent data loading, especially in areas with poor connectivity.`
      hypothesisText = 'If we implement request retry logic, add offline caching, and optimize API timeouts, we can reduce network failures by 70% and improve app reliability for users in low-connectivity areas within 6 weeks.'
    }
    // Payment specific themes
    else if (themeLower.includes('payment processing delays') || themeLower.includes('payment delay')) {
      problemStatement = `Payment processing delays identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Transactions take 3-5 seconds to process, causing user anxiety and 28% payment abandonment at the final step.`
      hypothesisText = 'If we optimize payment gateway integration, reduce processing time to <2 seconds, and add real-time status updates, we can reduce payment abandonment by 50% and improve checkout completion rates within 6 weeks.'
    } else if (themeLower.includes('reconciliation accuracy')) {
      problemStatement = `Payment reconciliation accuracy issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Manual reconciliation leads to 12% discrepancy rate, delayed settlements, and increased support tickets.`
      hypothesisText = 'If we automate reconciliation with AI-powered matching and implement real-time validation, we can reduce discrepancies to <2% and decrease reconciliation time by 75% within 8 weeks.'
    } else if (themeLower.includes('transaction matching')) {
      problemStatement = `Transaction matching issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Mismatched transactions (8% rate) cause settlement delays, manual intervention, and financial reporting inaccuracies.`
      hypothesisText = 'If we implement intelligent matching algorithms, add fuzzy matching for partial data, and automate exception handling, we can improve matching accuracy to 98% and reduce manual work by 80% within 10 weeks.'
    } else if (themeLower.includes('reporting') || themeLower.includes('visibility')) {
      problemStatement = `Payment reporting and visibility gaps identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Finance teams lack real-time insights, spend 20+ hours on manual reports, and face delayed decision-making.`
      hypothesisText = 'If we build real-time dashboards, automate report generation, and add predictive analytics, we can reduce reporting time by 90% and enable proactive financial management within 6 weeks.'
    }
    // Seller Verification themes
    else if (themeLower.includes('verification') && themeLower.includes('delay')) {
      problemStatement = `Seller verification process experiences delays with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority issues. Sellers face verification times averaging 3-5 days, unclear status updates, leading to 45% drop-off during onboarding.`
      hypothesisText = 'If we automate document verification using AI, provide real-time status updates, and reduce approval time to <24 hours, we can reduce seller onboarding drop-off from 45% to 20% within 8 weeks.'
    } else if (themeLower.includes('document upload')) {
      problemStatement = `Document upload issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Sellers experience upload failures (18% failure rate), unclear format requirements, and lack of guidance, causing frustration and abandonment.`
      hypothesisText = 'If we improve upload UX with drag-and-drop, add format validation, and provide inline guidance, we can reduce upload failures by 75% and improve seller satisfaction within 6 weeks.'
    } else if (themeLower.includes('identity verification')) {
      problemStatement = `Identity verification failures identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. 22% of identity checks fail due to photo quality issues, unclear instructions, and lack of retry guidance.`
      hypothesisText = 'If we add real-time photo quality checks, provide clear retry instructions, and implement AI-powered ID verification, we can reduce verification failures by 60% and improve onboarding completion within 8 weeks.'
    } else if (themeLower.includes('onboarding ux')) {
      problemStatement = `Onboarding UX problems identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Sellers find the process confusing, too long (avg 45 minutes), and lack progress indicators, resulting in 35% abandonment.`
      hypothesisText = 'If we simplify the onboarding flow, add progress tracking, and provide contextual help, we can reduce onboarding time by 50% and increase completion rates by 40% within 6 weeks.'
    } else if (themeLower.includes('communication gap')) {
      problemStatement = `Communication gaps identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Sellers don't receive timely updates, lack clarity on next steps, and feel unsupported, leading to increased support contacts and dissatisfaction.`
      hypothesisText = 'If we implement automated notifications, add in-app messaging, and provide proactive status updates, we can reduce support tickets by 50% and improve seller satisfaction by 35% within 6 weeks.'
    }
    // Generic payment/timeout fallback
    else if (themeLower.includes('payment') || themeLower.includes('timeout')) {
      problemStatement = `Payment processing experiences significant delays with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority issues. Users face payment failures averaging 2.8 seconds, leading to high cart abandonment rates of 68% at the payment step.`
      hypothesisText = 'If we reduce payment API timeout from 2.8s to <1.5s and implement automatic retry mechanisms, we can reduce payment-related cart abandonment from 68% to 40% within 6 weeks.'
    } else if (themeLower.includes('seller') || themeLower.includes('verification')) {
      problemStatement = `Seller verification process experiences delays with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority issues. Sellers face verification times averaging 3-5 days, leading to 45% drop-off during onboarding.`
      hypothesisText = 'If we automate document verification using AI and reduce approval time to <24 hours, we can reduce seller onboarding drop-off from 45% to 20% within 8 weeks.'
    } else if (themeLower.includes('mobile') || themeLower.includes('performance') || themeLower.includes('app')) {
      problemStatement = `Mobile app performance issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience slow load times (avg 4.2s), crashes (2.3% crash rate), and poor responsiveness, particularly during checkout and payment flows.`
      hypothesisText = 'If we optimize app load time to <2 seconds, reduce crash rate to <0.5%, and implement offline error handling, we can increase mobile conversion rates by 30% within 10 weeks.'
    } else {
      problemStatement = `Current system experiences issues related to ${selectedTheme.name.toLowerCase()}, with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority problems affecting user experience and business outcomes.`
      hypothesisText = `If we address ${selectedTheme.name.toLowerCase()} systematically based on identified signals, we can improve key metrics by 25-40% within 6-8 weeks.`
    }

    setHypothesis({
      problemStatement,
      hypothesis: hypothesisText,
      themeLocked: true,
      selectedTheme: selectedThemeId,
    })

    addMessage('assistant', `✅ **Hypothesis Formed**\n\n**Selected Theme:** ${selectedTheme.name}\n\n**Problem Statement:**\n${problemStatement}\n\n**Hypothesis:**\n${hypothesisText}\n\nYou can edit the hypothesis in the Hypothesis Formation section. Ready to generate the PRD?`, [
      { label: '📄 Generate PRD', action: 'generate-prd', primary: true, description: 'Create comprehensive PRD' },
      { label: '🔄 Try Different Theme', action: 'change-theme', primary: false, description: 'Explore another theme' }
    ])
  }

  const handleThemeSelect = (themeIndex: number) => {
    const selectedTheme = signalAnalysis.themes[themeIndex]
    
    addMessage('user', `I'd like to focus on: ${selectedTheme.name}`)
    
    setTimeout(() => {
      handleFormHypothesis(themeIndex)
    }, 500)
  }

  const handleGeneratePRD = () => {
    if (!hypothesis.themeLocked || !hypothesis.selectedTheme) {
      addMessage('assistant', '⚠️ Please select a theme and form a hypothesis first before generating the PRD.')
      return
    }

    setIsTyping(true)
    addMessage('assistant', '📝 Generating comprehensive PRD based on your hypothesis...')

    setTimeout(() => {
      const themeIdx = parseInt(hypothesis.selectedTheme!.replace('theme-', ''))
      const selectedTheme = signalAnalysis.themes[themeIdx]
      const prdContent = generatePRDFromTheme(hypothesis.selectedTheme, signalAnalysis.themes)

      if (prdContent) {
        setPrdSections([
          {
            id: 'overview',
            title: 'Executive Summary',
            content: prdContent.overview,
            editable: false
          },
          {
            id: 'problem',
            title: 'Problem Statement',
            content: prdContent.problem,
            editable: false
          },
          {
            id: 'goals',
            title: 'Goals & Success Metrics',
            content: prdContent.goals,
            editable: false
          },
          {
            id: 'functional',
            title: 'Functional Requirements',
            content: prdContent.functional,
            editable: false
          },
          {
            id: 'non-functional',
            title: 'Non-Functional Requirements',
            content: prdContent.nonFunctional,
            editable: false
          }
        ])

        // Update workspace stage
        if (currentWorkspace) {
          updateWorkspace(currentWorkspace.id, {
            lastStage: 'specification',
            lastModified: new Date().toISOString()
          })
          saveWorkspace()
        }

        setIsTyping(false)
        addMessage('assistant', `✅ **PRD Generated Successfully!**\n\n**Theme:** ${selectedTheme.name}\n\nI've created a comprehensive PRD with 5 sections:\n\n1. Executive Summary\n2. Problem Statement\n3. Goals & Success Metrics\n4. Functional Requirements\n5. Non-Functional Requirements\n\nReview the PRD in the PRD Generation section. You can edit any section or export it!`, [
          { label: '📄 Review PRD', action: 'review-prd', primary: true, description: 'Review all sections' },
          { label: '📤 Share & Handoff', action: 'share-team', primary: false, description: 'Share with team' }
        ])
      }
    }, 2000)
  }

  const handleHandoffToEngineering = () => {
    setHandoffStatus(prev => prev.map(item =>
      item.id === '2' ? { ...item, status: 'completed', description: 'Completed' } : item
    ))
    addMessage('assistant', 'Workspace has been handed off to Engineering! The team can now access all PRD details and start implementation.')
  }

  const handleStartIngesting = () => {
    const connectedSources = sources.filter(s => s.connected)
    if (connectedSources.length === 0) {
      addMessage('assistant', '⚠️ Please connect at least one source before starting ingestion. You can connect Slack, Jira, Confluence, OneDrive, or Adobe Analytics.')
      return
    }

    // Simulate ingestion process
    setIsTyping(true)
    addMessage('assistant', `🚀 Starting ingestion from ${connectedSources.length} connected source${connectedSources.length > 1 ? 's' : ''}...\n\nI'm processing documents, tickets, and conversations to extract product signals. This may take a moment.`)

    setTimeout(() => {
      setIsTyping(false)
      const ingestedCount = Math.floor(Math.random() * 50) + 120

      // Populate Signal Analysis with data
      const themes = [
        { name: 'Payment Timeout Issues', signals: 34, priority: 'P0', status: 'Critical' },
        { name: 'Promo Code UX Problems', signals: 18, priority: 'P1', status: 'High' },
        { name: 'Localization Gaps', signals: 11, priority: 'P2', status: 'Medium' },
        { name: 'Mobile Checkout Friction', signals: 28, priority: 'P1', status: 'High' },
        { name: 'Error Message Clarity', signals: 15, priority: 'P2', status: 'Medium' },
      ]

      setSignalAnalysis({
        totalSignals: ingestedCount,
        keyThemes: themes.length,
        insights: Math.floor(ingestedCount / 5),
        themes: themes,
        analyzed: true,
      })

      // Populate Hypothesis Formation
      setHypothesis({
        problemStatement: 'Current checkout flow experiences a 68% abandonment rate on mobile devices, primarily due to payment timeouts (avg 2.8s), unclear promo code error handling, and lack of localized error messages in key markets (IN, CA, MX).',
        hypothesis: 'If we reduce payment API timeout from 2.8s to <1.5s, add clear promo code fallback messaging, and provide localized error messages in Hindi, Spanish, and French, we can reduce cart abandonment from 68% to 40% within 6 weeks.',
        themeLocked: true,
        selectedTheme: 'theme-0',
      })

      // Populate PRD Sections
      setPrdSections([
        {
          id: 'overview',
          title: 'Executive Summary',
          content: 'This PRD outlines optimizations to the checkout flow to reduce cart abandonment from 68% to 40%.',
          editable: false
        },
        {
          id: 'problem',
          title: 'Problem Statement',
          content: 'Current checkout flow experiences high abandonment due to payment timeouts, unclear error handling, and lack of localization.',
          editable: false
        },
        {
          id: 'solution',
          title: 'Proposed Solution',
          content: 'Optimize payment API timeout, add clear promo code fallback messaging, and provide localized error messages.',
          editable: false
        }
      ])

      // Update workspace stage and provide feedback
      if (currentWorkspace) {
        updateWorkspace(currentWorkspace.id, {
          lastStage: 'discovery',
          lastModified: new Date().toISOString()
        })
        saveWorkspace()
      }

      addMessage('assistant', `✅ Ingestion complete! I've processed ${ingestedCount} signals and identified ${themes.length} key themes.\n\nI've populated:\n• **Signal Analysis** - View themes and priorities\n• **Hypothesis Formation** - Problem statement and hypothesis\n• **PRD Generation** - Initial PRD sections\n\nReview the canvas on the right and let me know if you'd like to refine anything!`, [
        { label: '🔍 Analyze Signals', action: 'analyze-signals', primary: true },
        { label: '📄 Review PRD', action: 'review-prd' }
      ])
    }, 2000)
  }

  const handleAction = (action: string) => {
    if (action === 'connect-sources') {
      addMessage('assistant', 'Great! I can help you connect your data sources. In the Connect Sources section on the right, you can connect:\n\n• **Slack** - Capture product discussions and feedback\n• **Jira** - Import tickets and user stories\n• **Confluence** - Pull in documentation and PRDs\n• **OneDrive** - Access shared documents\n• **Adobe Analytics** - Get user behavior data\n\nOnce connected, I\'ll automatically start capturing signals!', [
        { label: '🚀 Start Ingestion', action: 'start-ingesting', primary: true }
      ])
    } else if (action === 'upload-docs') {
      addMessage('assistant', 'Perfect! You can upload documents in the Connect Sources section. I can process:\n\n• PDFs (PRDs, research papers)\n• DOCX (Word documents, specs)\n• XLSX (Data sheets, analytics)\n\nJust drag and drop files or click "Choose Files". Once uploaded, click "Start Ingesting" to extract signals!')
    } else if (action === 'share-prompt') {
      addMessage('assistant', 'I\'d love to hear about your idea! Please share:\n\n• What problem are you trying to solve?\n• Who is the target user?\n• What outcomes are you hoping to achieve?\n\nType your response below and I\'ll help you structure it into a clear problem statement and hypothesis.')
    } else if (action === 'start-ingesting') {
      handleStartIngesting()
    } else if (action === 'analyze-signals') {
      handleAnalyzeSignals()
    } else if (action === 'generate-prd') {
      handleGeneratePRD()
    } else if (action === 'create-personas') {
      addMessage('assistant', 'I\'ll help you create user personas based on your signals. Let me analyze the user data and generate personas with:\n\n• Demographics and background\n• Goals and motivations\n• Pain points and frustrations\n• Preferred channels and behaviors\n\nGenerating personas now...', [
        { label: '✅ View Personas', action: 'view-personas', primary: true }
      ])
      setTimeout(() => {
        addMessage('assistant', '✅ I\'ve created 3 user personas based on your signals:\n\n1. **Primary User** - Active power user seeking efficiency\n2. **Secondary User** - Occasional user needing guidance\n3. **Edge Case User** - Unique needs requiring special handling\n\nYou can review and refine them in the Discovery section.')
      }, 1500)
    } else if (action === 'form-hypothesis') {
      handleFormHypothesis()
    } else if (action === 'change-theme') {
      addMessage('assistant', `🔄 **Change Theme**\n\nNo problem! You can select a different theme to explore. Here are all available themes:\n\n${signalAnalysis.themes.map((t, i) => `${i + 1}. **${t.name}** (${t.signals} signals, ${t.status})`).join('\n')}\n\nClick on any theme in the Signal Analysis section to switch focus and regenerate the hypothesis and PRD.`)
    } else if (action === 'map-journeys') {
      addMessage('assistant', 'I\'ll map out the user journey based on your signals and personas. This will include:\n\n• User touchpoints\n• Pain points at each stage\n• Opportunities for improvement\n• Emotional journey mapping\n\nCreating journey map...')
      setTimeout(() => {
        addMessage('assistant', '✅ Journey map created! I\'ve identified 5 key stages with 3 major pain points. Check the Discovery section to view the interactive journey map.')
      }, 1500)
    } else if (action === 'define-problem') {
      addMessage('assistant', 'Let\'s define a clear problem statement. Based on your signals, I see potential problems around:\n\n• Payment timeouts (34 signals)\n• Promo code UX issues (18 signals)\n• Localization gaps (11 signals)\n\nWhich problem would you like to focus on? Or share a different problem you\'ve identified.')
    } else if (action === 'handoff-engineering') {
      handleHandoffToEngineering()
    } else if (action === 'review-prd') {
      addMessage('assistant', `📋 **PRD Review**\n\nI've generated a comprehensive PRD with 5 sections:\n\n1. **Overview** - High-level summary and timeline\n2. **Problem Statement** - Detailed problem analysis\n3. **Proposed Solution** - Solution approach and key changes\n4. **Requirements** - Functional and non-functional requirements\n5. **Success Metrics** - Measurable outcomes and KPIs\n\nYou can edit any section directly in the PRD Generation panel. Would you like me to help refine any specific section?`, [
        { label: '✏️ Edit Overview', action: 'edit-overview', primary: false, description: 'Refine the overview section' },
        { label: '✅ Review Requirements', action: 'review-requirements', primary: true, description: 'Check requirements completeness' }
      ])
    } else if (action === 'deep-dive') {
      addMessage('assistant', `🔍 **Deep Dive Analysis**\n\nLet me break down the signals I found:\n\n**Payment Timeout Issues (34 signals)**\n• Average timeout: 2.8 seconds\n• Affects 68% of mobile checkout attempts\n• Most common in India market\n• User frustration score: High\n\n**Promo Code UX Problems (18 signals)**\n• Unclear error messages\n• No fallback suggestions\n• Users abandon after failed promo\n\n**Mobile Checkout Friction (28 signals)**\n• Multiple form fields\n• Slow page load times\n• Poor error recovery\n\nWould you like me to dive deeper into any specific theme?`, [
        { label: '💳 Payment Analysis', action: 'payment-analysis', primary: true, description: 'Deep dive into payment issues' },
        { label: '🎫 Promo Code Analysis', action: 'promo-analysis', primary: false, description: 'Explore promo code problems' }
      ])
    } else if (action === 'edit-prd') {
      addMessage('assistant', `✏️ **PRD Editing**\n\nYou can edit any PRD section directly in the panel on the right. I can help you:\n\n• Refine problem statements\n• Add more requirements\n• Improve success metrics\n• Enhance solution descriptions\n\nWhich section would you like to improve? Or just start editing - I'll provide suggestions as you type!`)
    } else if (action === 'share-team') {
      addMessage('assistant', `👥 **Team Collaboration**\n\nGreat idea! Sharing with your team enables:\n\n• Collaborative PRD review\n• Engineering handoff\n• Stakeholder alignment\n• Progress tracking\n\nYou can invite team members in the Collaboration & Handoff section. I'll notify them and they can start reviewing the PRD.`, [
        { label: '📤 Handoff to Engineering', action: 'handoff-engineering', primary: true, description: 'Start engineering handoff' }
      ])
    } else if (action === 'review-themes') {
      addMessage('assistant', `📊 **Theme Review**\n\nHere are the key themes I identified:\n\n1. **Payment Timeout Issues** (34 signals) - Critical\n   → Most urgent, affects majority of users\n\n2. **Promo Code UX Problems** (18 signals) - High\n   → Clear UX improvement opportunity\n\n3. **Mobile Checkout Friction** (28 signals) - High\n   → Multiple pain points in mobile flow\n\n4. **Localization Gaps** (11 signals) - Medium\n   → Important for target markets\n\n5. **Error Message Clarity** (15 signals) - Medium\n   → Affects user understanding\n\nWhich theme would you like to prioritize?`, [
        { label: '🎯 Focus on Payment', action: 'focus-payment', primary: true, description: 'Prioritize payment timeout fixes' },
        { label: '📱 Focus on Mobile', action: 'focus-mobile', primary: false, description: 'Improve mobile experience' }
      ])
    } else if (action === 'refine-problem') {
      addMessage('assistant', `✏️ **Problem Refinement**\n\nThe current problem statement focuses on:\n• 68% abandonment rate\n• Payment timeouts\n• Localization gaps\n\nI can help you refine it by:\n• Adding more context from signals\n• Quantifying impact better\n• Clarifying user segments\n• Strengthening the business case\n\nWould you like me to suggest improvements, or do you want to edit it directly in the Hypothesis Formation section?`)
    } else {
      addMessage('assistant', `I'll help you with ${action.replace(/-/g, ' ')}. Let me process that for you...`)
      setTimeout(() => {
        addMessage('assistant', `✅ Done! I've completed ${action.replace(/-/g, ' ')}. Check the workspace sections on the right to see the updates.`)
      }, 1000)
    }
  }

  const addMessage = (role: 'user' | 'assistant', content: string, actionButtons?: { label: string; action: string; primary?: boolean; description?: string }[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      timestamp: new Date(),
      actionButtons,
    }])
  }

  const handleSendMessage = () => {
    if (!input.trim()) return
    addMessage('user', input)
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      addMessage('assistant', "I understand. Let me help you with that.")
      setIsTyping(false)
    }, 1000)
  }

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return
    const workspaceId = createWorkspace(newWorkspaceName, newWorkspaceDescription)
    setNewWorkspaceName('')
    setNewWorkspaceDescription('')
    setShowCreateModal(false)
    selectWorkspace(workspaceId)
  }

  const handleSelectWorkspace = (workspaceId: string) => {
    // Check if it's an example workspace
    const exampleWorkspace = exampleWorkspaces.find(w => w.id === workspaceId)
    if (exampleWorkspace) {
      // Check if we already have a workspace for this example
      const existingWorkspace = workspaces.find(w =>
        w.name === exampleWorkspace.name &&
        w.description === exampleWorkspace.description
      )

      if (existingWorkspace) {
        // Use existing workspace - ensure stage is correct
        if (existingWorkspace.lastStage !== exampleWorkspace.lastStage) {
          updateWorkspace(existingWorkspace.id, {
            lastStage: exampleWorkspace.lastStage,
            status: exampleWorkspace.status as 'Draft' | 'In Progress' | 'Review' | 'Approved' | 'Completed',
          })
        }
        selectWorkspace(existingWorkspace.id)
        setSelectedExampleWorkspace(workspaceId)
      } else {
        // Create new workspace from example
        const tempId = createWorkspace(exampleWorkspace.name, exampleWorkspace.description)
        // Update workspace properties IMMEDIATELY to set correct stage
        updateWorkspace(tempId, {
          lastStage: exampleWorkspace.lastStage,
          status: exampleWorkspace.status as 'Draft' | 'In Progress' | 'Review' | 'Approved' | 'Completed',
          lastModified: exampleWorkspace.lastModified,
        })
        setSelectedExampleWorkspace(workspaceId)
        // Data will be loaded by useEffect when currentWorkspace changes
      }
    } else {
      // Regular workspace selection
      selectWorkspace(workspaceId)
      setSelectedExampleWorkspace(null)
    }
  }

  const handleEditWorkspace = () => {
    if (currentWorkspace) {
      setEditWorkspaceName(currentWorkspace.name)
      setEditWorkspaceDescription(currentWorkspace.description || '')
      setIsEditingWorkspace(true)
    }
  }

  const handleSaveEdit = () => {
    if (currentWorkspace && editWorkspaceName.trim()) {
      updateWorkspace(currentWorkspace.id, {
        name: editWorkspaceName,
        description: editWorkspaceDescription,
      })
      setIsEditingWorkspace(false)
      saveWorkspace()
    }
  }

  const generatePRDFromTheme = (selectedThemeId: string | null, themes: Array<{ name: string; signals: number; priority: string; status: string }>) => {
    if (!selectedThemeId) return null

    const themeIndex = parseInt(selectedThemeId.replace('theme-', ''))
    const selectedTheme = themes[themeIndex]

    if (!selectedTheme) return null

    const themeLower = selectedTheme.name.toLowerCase()

    // Generate PRD content based on selected theme - check EXACT theme first, then fallback
    
    // Mobile App Performance specific themes
    if (themeLower.includes('app load time')) {
      return {
        overview: 'This PRD outlines requirements for optimizing app initialization and load times, including lazy loading, bundle optimization, and performance monitoring.',
        problem: `App load time issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience slow initial load times (avg 4.2s) and sluggish screen transitions, causing 35% of users to abandon the app before completing actions.`,
        goals: 'Primary Goal: Reduce app load time to <2 seconds and decrease app abandonment by 50%',
        functional: 'FR1: Implement code splitting and lazy loading for non-critical modules\nFR2: Optimize asset loading with caching and compression\nFR3: Add skeleton screens during initial load\nFR4: Preload critical resources on app launch\nFR5: Monitor and track load time metrics per screen',
        nonFunctional: 'NFR1: App cold start <2s, warm start <1s (P95)\nNFR2: Bundle size reduction of 40%\nNFR3: Support iOS 14+ and Android 10+\nNFR4: Real-time performance monitoring',
      }
    } else if (themeLower.includes('checkout performance')) {
      return {
        overview: 'This PRD outlines requirements for optimizing checkout flow performance, including API optimization, optimistic UI updates, and progress indicators.',
        problem: `Checkout flow performance issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience delays during checkout (avg 3.5s per step), payment processing lags, and UI freezes, resulting in 42% checkout abandonment.`,
        goals: 'Primary Goal: Reduce checkout time by 60% and increase conversion rates by 25%',
        functional: 'FR1: Optimize checkout API calls with parallel processing\nFR2: Implement optimistic UI updates for instant feedback\nFR3: Add step-by-step progress indicators\nFR4: Preload payment gateway during cart review\nFR5: Cache user data to reduce API calls',
        nonFunctional: 'NFR1: Checkout API response time <1.5s (P95)\nNFR2: Support 5K concurrent checkout sessions\nNFR3: Graceful degradation during API failures\nNFR4: Zero data loss during network interruptions',
      }
    } else if (themeLower.includes('crash') || themeLower.includes('error rates')) {
      return {
        overview: 'This PRD outlines requirements for improving app stability, reducing crashes, and implementing robust error handling mechanisms.',
        problem: `App stability issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience crashes (2.3% crash rate), ANR errors, and unexpected logouts, particularly on Android devices and during payment flows.`,
        goals: 'Primary Goal: Reduce crash rate to <0.5% and improve user retention by 30%',
        functional: 'FR1: Implement error boundaries for critical sections\nFR2: Add automatic crash recovery with state preservation\nFR3: Implement offline fallbacks for network failures\nFR4: Add logging and diagnostics for crash analysis\nFR5: Create user-friendly error messages with recovery actions',
        nonFunctional: 'NFR1: Crash-free rate >99.5%\nNFR2: ANR rate <0.3%\nNFR3: Real-time crash monitoring and alerting\nNFR4: Automated crash reporting with stack traces',
      }
    } else if (themeLower.includes('network timeout')) {
      return {
        overview: 'This PRD outlines requirements for improving network reliability, implementing retry logic, and adding offline capabilities.',
        problem: `Network connectivity issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience timeout errors, failed API requests (15% failure rate), and inconsistent data loading, especially in areas with poor connectivity.`,
        goals: 'Primary Goal: Reduce network failures by 70% and improve app reliability in low-connectivity areas',
        functional: 'FR1: Implement exponential backoff retry logic for failed requests\nFR2: Add offline data caching with sync on reconnect\nFR3: Optimize API timeouts based on request type\nFR4: Display connection status and retry options\nFR5: Queue critical actions for auto-retry',
        nonFunctional: 'NFR1: API failure rate <3%\nNFR2: Support offline mode for core features\nNFR3: Automatic retry with max 3 attempts\nNFR4: Network monitoring with adaptive timeouts',
      }
    }
    // Payment Reconciliation specific themes
    else if (themeLower.includes('payment processing delays') || themeLower.includes('payment delay')) {
      return {
        overview: 'This PRD outlines requirements for optimizing payment processing speed, adding real-time status updates, and improving user confidence during payment.',
        problem: `Payment processing delays identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Transactions take 3-5 seconds to process, causing user anxiety and 28% payment abandonment at the final step.`,
        goals: 'Primary Goal: Reduce payment processing time to <2 seconds and decrease payment abandonment by 50%',
        functional: 'FR1: Optimize payment gateway integration and reduce latency\nFR2: Implement parallel validation for payment data\nFR3: Add real-time payment status updates with progress indicator\nFR4: Preload payment processors during cart review\nFR5: Display estimated processing time to users',
        nonFunctional: 'NFR1: Payment API response <2s (P95)\nNFR2: 99.9% payment processing uptime\nNFR3: Support 10K concurrent transactions\nNFR4: PCI DSS compliance maintained',
      }
    } else if (themeLower.includes('reconciliation accuracy')) {
      return {
        overview: 'This PRD outlines requirements for automating payment reconciliation with AI-powered matching and real-time validation.',
        problem: `Payment reconciliation accuracy issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Manual reconciliation leads to 12% discrepancy rate, delayed settlements, and increased support tickets.`,
        goals: 'Primary Goal: Reduce discrepancies to <2% and decrease reconciliation time by 75%',
        functional: 'FR1: Implement AI-powered transaction matching algorithm\nFR2: Add real-time validation for incoming transactions\nFR3: Automate exception handling with smart rules\nFR4: Generate automated discrepancy reports\nFR5: Provide manual review queue for edge cases',
        nonFunctional: 'NFR1: Matching accuracy >98%\nNFR2: Real-time processing for all transactions\nNFR3: Support multi-currency reconciliation\nNFR4: Audit trail for all reconciliation actions',
      }
    } else if (themeLower.includes('transaction matching')) {
      return {
        overview: 'This PRD outlines requirements for intelligent transaction matching, fuzzy matching algorithms, and automated exception handling.',
        problem: `Transaction matching issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Mismatched transactions (8% rate) cause settlement delays, manual intervention, and financial reporting inaccuracies.`,
        goals: 'Primary Goal: Improve matching accuracy to 98% and reduce manual work by 80%',
        functional: 'FR1: Implement intelligent matching with multiple criteria\nFR2: Add fuzzy matching for partial data matches\nFR3: Automate exception handling with configurable rules\nFR4: Create confidence scoring for matches\nFR5: Provide batch matching for bulk transactions',
        nonFunctional: 'NFR1: Matching engine processes 10K transactions/min\nNFR2: Matching accuracy >98%\nNFR3: Support configurable matching rules\nNFR4: Real-time matching with <5s latency',
      }
    } else if (themeLower.includes('reporting') || themeLower.includes('visibility')) {
      return {
        overview: 'This PRD outlines requirements for real-time payment dashboards, automated reporting, and predictive analytics for finance teams.',
        problem: `Payment reporting and visibility gaps identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Finance teams lack real-time insights, spend 20+ hours on manual reports, and face delayed decision-making.`,
        goals: 'Primary Goal: Reduce reporting time by 90% and enable proactive financial management',
        functional: 'FR1: Build real-time dashboards with key payment metrics\nFR2: Automate daily, weekly, monthly report generation\nFR3: Add predictive analytics for revenue forecasting\nFR4: Implement custom report builder\nFR5: Enable data export in multiple formats',
        nonFunctional: 'NFR1: Dashboard refresh rate <30s\nNFR2: Report generation <5 minutes\nNFR3: Support 5 years of historical data\nNFR4: Role-based access control',
      }
    }
    // Seller Verification themes
    else if (themeLower.includes('verification') && themeLower.includes('delay')) {
      return {
        overview: 'This PRD outlines requirements for automating seller verification using AI, providing real-time status updates, and reducing approval times.',
        problem: `Seller verification process experiences delays with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority issues. Sellers face verification times averaging 3-5 days, unclear status updates, leading to 45% drop-off during onboarding.`,
        goals: 'Primary Goal: Reduce verification time to <24 hours and decrease seller drop-off from 45% to 20%',
        functional: 'FR1: Implement AI-powered document verification\nFR2: Add real-time status updates via email and SMS\nFR3: Automate identity checks with third-party services\nFR4: Create priority queue for high-value sellers\nFR5: Provide self-service resubmission',
        nonFunctional: 'NFR1: AI verification accuracy >95%\nNFR2: Process 80% of verifications within 24 hours\nNFR3: Support 1K concurrent verification requests\nNFR4: GDPR and data privacy compliance',
      }
    } else if (themeLower.includes('document upload')) {
      return {
        overview: 'This PRD outlines requirements for improving document upload UX with drag-and-drop, format validation, and inline guidance.',
        problem: `Document upload issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Sellers experience upload failures (18% failure rate), unclear format requirements, and lack of guidance, causing frustration and abandonment.`,
        goals: 'Primary Goal: Reduce upload failures by 75% and improve seller satisfaction',
        functional: 'FR1: Implement drag-and-drop file upload interface\nFR2: Add real-time format and size validation\nFR3: Provide inline guidance for required documents\nFR4: Support multiple file formats (PDF, JPG, PNG)\nFR5: Add image compression for large files',
        nonFunctional: 'NFR1: Upload success rate >95%\nNFR2: Support files up to 10MB\nNFR3: Upload time <5s for average file\nNFR4: Mobile-responsive upload interface',
      }
    } else if (themeLower.includes('identity verification')) {
      return {
        overview: 'This PRD outlines requirements for improving identity verification with real-time photo quality checks, clear instructions, and AI-powered ID verification.',
        problem: `Identity verification failures identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. 22% of identity checks fail due to photo quality issues, unclear instructions, and lack of retry guidance.`,
        goals: 'Primary Goal: Reduce verification failures by 60% and improve onboarding completion',
        functional: 'FR1: Add real-time photo quality assessment\nFR2: Provide clear retry instructions with examples\nFR3: Implement AI-powered ID document verification\nFR4: Add liveness detection for selfie verification\nFR5: Support multiple ID types (passport, license, national ID)',
        nonFunctional: 'NFR1: ID verification accuracy >95%\nNFR2: Verification time <30 seconds\nNFR3: Support 50+ countries\nNFR4: Biometric data encryption',
      }
    } else if (themeLower.includes('onboarding ux')) {
      return {
        overview: 'This PRD outlines requirements for simplifying seller onboarding flow, adding progress tracking, and providing contextual help.',
        problem: `Onboarding UX problems identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Sellers find the process confusing, too long (avg 45 minutes), and lack progress indicators, resulting in 35% abandonment.`,
        goals: 'Primary Goal: Reduce onboarding time by 50% and increase completion rates by 40%',
        functional: 'FR1: Simplify onboarding flow to 5 key steps\nFR2: Add progress bar with step completion indicators\nFR3: Provide contextual help and tooltips\nFR4: Enable save-and-resume for partial completions\nFR5: Add onboarding checklist with task breakdown',
        nonFunctional: 'NFR1: Target onboarding time <20 minutes\nNFR2: Mobile-responsive design\nNFR3: Support multiple languages\nNFR4: Auto-save every 30 seconds',
      }
    } else if (themeLower.includes('communication gap')) {
      return {
        overview: 'This PRD outlines requirements for implementing automated notifications, in-app messaging, and proactive status updates for sellers.',
        problem: `Communication gaps identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Sellers don't receive timely updates, lack clarity on next steps, and feel unsupported, leading to increased support contacts and dissatisfaction.`,
        goals: 'Primary Goal: Reduce support tickets by 50% and improve seller satisfaction by 35%',
        functional: 'FR1: Implement automated email and SMS notifications\nFR2: Add in-app messaging with status updates\nFR3: Provide proactive alerts for pending actions\nFR4: Create help center with FAQs and tutorials\nFR5: Enable live chat support during business hours',
        nonFunctional: 'NFR1: Notification delivery <1 minute\nNFR2: Support multi-channel messaging\nNFR3: Message delivery rate >99%\nNFR4: Personalized messaging based on seller status',
      }
    }
    // Generic fallbacks
    else if (themeLower.includes('payment') || themeLower.includes('timeout')) {
      return {
        overview: 'This PRD outlines requirements for optimizing payment processing to reduce timeouts and improve checkout success rates. Focus areas include API optimization, retry mechanisms, and user-friendly error handling.',
        problem: `Payment processing experiences significant delays with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority issues. Users face payment failures averaging 2.8 seconds, leading to high cart abandonment rates of 68% at the payment step.`,
        goals: 'Primary Goal: Reduce payment timeout from 2.8s to <1.5s and decrease payment-related cart abandonment by 40%',
        functional: 'FR1: Payment API must respond within 1.5s (95th percentile)\nFR2: Implement automatic retry mechanism for failed payments\nFR3: Display clear payment status indicators\nFR4: Provide user-friendly error messages with actionable next steps',
        nonFunctional: 'NFR1: 99.9% uptime for payment service\nNFR2: Support 10K concurrent payment requests\nNFR3: Graceful degradation during payment service outages',
      }
    } else if (themeLower.includes('promo') || themeLower.includes('code')) {
      return {
        overview: 'This PRD outlines requirements for improving promo code application UX, including real-time validation, clear error messaging, and intelligent fallback suggestions.',
        problem: `Promo code application process suffers from ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority UX problems. Users experience unclear error messages, invalid code rejections without alternatives, and confusion about code eligibility.`,
        goals: 'Primary Goal: Increase successful promo code applications by 35% and improve user satisfaction with promo code experience',
        functional: 'FR1: Real-time promo code validation as user types\nFR2: Clear, specific error messages for invalid codes\nFR3: Suggest alternative valid promo codes\nFR4: Display code eligibility criteria clearly',
        nonFunctional: 'NFR1: Promo code validation API response <500ms\nNFR2: Support 5K concurrent promo code checks\nNFR3: Cache valid promo codes for performance',
      }
    } else if (themeLower.includes('localization') || themeLower.includes('language')) {
      return {
        overview: 'This PRD outlines requirements for comprehensive localization of error messages and critical UI elements in key target markets.',
        problem: `Localization gaps exist across key markets, with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority issues. Error messages, help text, and critical UI elements lack proper translation, causing user confusion in target markets (IN, CA, MX).`,
        goals: 'Primary Goal: Improve user comprehension by 50% and reduce support tickets related to language barriers by 30%',
        functional: 'FR1: Localize all error messages in Hindi, Spanish, and French\nFR2: Translate critical UI elements and help text\nFR3: Support right-to-left text for Arabic markets\nFR4: Provide language switcher in error states',
        nonFunctional: 'NFR1: Translation API response <300ms\nNFR2: Support 10 languages initially\nNFR3: Maintain translation quality score >95%',
      }
    } else if (themeLower.includes('mobile') || themeLower.includes('app')) {
      return {
        overview: 'This PRD outlines requirements for optimizing mobile app performance, focusing on load times, error handling, and responsiveness.',
        problem: `Mobile app performance issues identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority. Users experience slow load times, crashes, and poor responsiveness, particularly during checkout and payment flows.`,
        goals: 'Primary Goal: Increase mobile conversion rates by 25% and reduce app abandonment through performance improvements',
        functional: 'FR1: Reduce app load time to <2 seconds\nFR2: Optimize checkout flow performance\nFR3: Implement offline error handling\nFR4: Add loading indicators and progress feedback',
        nonFunctional: 'NFR1: App crash rate <0.1%\nNFR2: Support iOS 14+ and Android 10+\nNFR3: Network request timeout handling',
      }
    }

    // Default/fallback content
    return {
      overview: `This PRD outlines requirements for addressing ${selectedTheme.name.toLowerCase()}, identified through ${selectedTheme.signals} signals with ${selectedTheme.status.toLowerCase()} priority.`,
      problem: `Current system experiences issues related to ${selectedTheme.name.toLowerCase()}, with ${selectedTheme.signals} signals indicating ${selectedTheme.status.toLowerCase()} priority problems affecting user experience and business outcomes.`,
      goals: `Primary Goal: Address ${selectedTheme.name.toLowerCase()} to improve user experience and achieve measurable business impact`,
      functional: `FR1: Address core issues related to ${selectedTheme.name.toLowerCase()}\nFR2: Implement solutions based on ${selectedTheme.signals} identified signals\nFR3: Monitor and measure impact\nFR4: Iterate based on user feedback`,
      nonFunctional: 'NFR1: System reliability and performance\nNFR2: Scalability requirements\nNFR3: Monitoring and observability',
    }
  }

  const loadWorkspaceData = (stage: string) => {
    if (!currentWorkspace) return

    // Find the example workspace that matches current workspace
    const exampleWorkspace = exampleWorkspaces.find(w =>
      w.name === currentWorkspace.name &&
      w.description === currentWorkspace.description
    )

    if (!exampleWorkspace || !exampleWorkspace.hasData) return

    // Generate workspace-specific themes based on workspace name (used across multiple sections)
    let themes: Array<{ name: string; signals: number; priority: string; status: string }> = []

    if (currentWorkspace.name.includes('Seller Verification')) {
      themes = [
        { name: 'Verification Process Delays', signals: 245, priority: 'P0', status: 'Critical' },
        { name: 'Document Upload Issues', signals: 189, priority: 'P1', status: 'High' },
        { name: 'Identity Verification Failures', signals: 156, priority: 'P1', status: 'High' },
        { name: 'Onboarding UX Problems', signals: 134, priority: 'P2', status: 'Medium' },
        { name: 'Communication Gaps', signals: 123, priority: 'P2', status: 'Medium' },
      ]
    } else if (currentWorkspace.name.includes('Mobile App Performance')) {
      themes = [
        { name: 'App Load Time Issues', signals: 142, priority: 'P0', status: 'Critical' },
        { name: 'Checkout Performance', signals: 98, priority: 'P1', status: 'High' },
        { name: 'Crash and Error Rates', signals: 67, priority: 'P1', status: 'High' },
        { name: 'Network Timeout Problems', signals: 35, priority: 'P2', status: 'Medium' },
      ]
    } else if (currentWorkspace.name.includes('Payment Reconciliation')) {
      themes = [
        { name: 'Payment Processing Delays', signals: 198, priority: 'P0', status: 'Critical' },
        { name: 'Reconciliation Accuracy', signals: 156, priority: 'P1', status: 'High' },
        { name: 'Transaction Matching Issues', signals: 112, priority: 'P1', status: 'High' },
        { name: 'Reporting and Visibility', signals: 57, priority: 'P2', status: 'Medium' },
      ]
    } else {
      themes = [
        { name: 'Payment Timeout Issues', signals: 34, priority: 'P0', status: 'Critical' },
        { name: 'Promo Code UX Problems', signals: 18, priority: 'P1', status: 'High' },
        { name: 'Localization Gaps', signals: 11, priority: 'P2', status: 'Medium' },
        { name: 'Mobile Checkout Friction', signals: 28, priority: 'P1', status: 'High' },
        { name: 'Error Message Clarity', signals: 15, priority: 'P2', status: 'Medium' },
      ]
    }

    // Populate signal analysis for all stages past wibey
    if (stage !== 'wibey') {
      setSignalAnalysis({
        totalSignals: exampleWorkspace.signalCount,
        keyThemes: themes.length,
        insights: Math.floor(exampleWorkspace.signalCount / 5),
        themes: themes,
        analyzed: true,
      })
    }

    // Track selected theme ID for use in PRD generation
    let selectedThemeId = 'theme-0'

    // Populate hypothesis if past capture stage - use first theme by default
    if (stage !== 'wibey' && stage !== 'capture') {
      // Use the themes we just generated above, or fallback
      const themesToUse = themes.length > 0 ? themes : [
        { name: 'Payment Timeout Issues', signals: 34, priority: 'P0', status: 'Critical' },
      ]
      const firstTheme = themesToUse[0]
      const themeLower = firstTheme.name.toLowerCase()

      let problemStatement = ''
      let hypothesisText = ''

      if (themeLower.includes('payment') || themeLower.includes('timeout')) {
        problemStatement = `Current payment processing experiences significant delays, with ${firstTheme.signals} signals indicating ${firstTheme.status.toLowerCase()} priority issues. Users face payment failures averaging 2.8 seconds, leading to high cart abandonment rates.`
        hypothesisText = `If we optimize payment API response times to under 1.5 seconds and implement retry mechanisms with clear error messaging, we can reduce payment-related cart abandonment by 40% and improve user trust in the checkout process.`
      } else if (themeLower.includes('verification')) {
        problemStatement = `Seller verification process experiences delays and friction, with ${firstTheme.signals} signals indicating ${firstTheme.status.toLowerCase()} priority issues. Sellers face long wait times, unclear requirements, and frequent verification failures.`
        hypothesisText = `If we streamline the verification process, improve document upload UX, and provide clear guidance, we can reduce verification time by 50% and increase successful verifications by 35%.`
      } else if (themeLower.includes('mobile') || themeLower.includes('app')) {
        problemStatement = `Mobile app performance issues identified through ${firstTheme.signals} signals with ${firstTheme.status.toLowerCase()} priority. Users experience slow load times, crashes, and poor responsiveness.`
        hypothesisText = `If we optimize mobile app performance by reducing load times and improving error handling, we can increase mobile conversion rates by 25% and reduce app abandonment.`
      } else {
        problemStatement = `Current system experiences issues related to ${firstTheme.name.toLowerCase()}, with ${firstTheme.signals} signals indicating ${firstTheme.status.toLowerCase()} priority problems.`
        hypothesisText = `If we address ${firstTheme.name.toLowerCase()} by implementing targeted solutions, we can improve user experience and achieve measurable business impact.`
      }

      setHypothesis({
        problemStatement,
        hypothesis: hypothesisText,
        themeLocked: true,
        selectedTheme: selectedThemeId,
      })
    }

    // Populate PRD if past discovery stage - use selected theme
    if (stage === 'specification' || stage === 'design' || stage === 'plan' || stage === 'build') {
      // Use the themes we just generated, not signalAnalysis.themes which may not be set yet
      const prdContent = generatePRDFromTheme(selectedThemeId, themes)

      if (prdContent) {
        setPrdSections([
          {
            id: 'overview',
            title: 'Executive Summary',
            content: prdContent.overview,
            editable: false
          },
          {
            id: 'problem',
            title: 'Problem Statement',
            content: prdContent.problem,
            editable: false
          },
          {
            id: 'goals',
            title: 'Goals & Success Metrics',
            content: prdContent.goals,
            editable: false
          },
          {
            id: 'personas',
            title: 'User Personas & Journeys',
            content: 'Primary persona: Users affected by the identified theme who experience the problems outlined in the problem statement.',
            editable: false
          },
          {
            id: 'functional',
            title: 'Functional Requirements',
            content: prdContent.functional,
            editable: false
          },
          {
            id: 'non-functional',
            title: 'Non-Functional Requirements',
            content: prdContent.nonFunctional,
            editable: false
          },
          {
            id: 'api',
            title: 'API Contracts & Dependencies',
            content: 'API contracts and dependencies will be defined based on the selected theme and requirements.',
            editable: false
          },
          {
            id: 'feature-flags',
            title: 'Feature Flags & Rollout',
            content: `Feature flag: ${themes.find((_, idx) => selectedThemeId === `theme-${idx}`)?.name.toLowerCase().replace(/\s+/g, '_') || 'optimization'}_v2\nRollout: 10% → 50% → 100% over 2 weeks\nA/B testing: Control vs Optimized flow`,
            editable: false
          },
          {
            id: 'risks',
            title: 'Risks & Mitigation',
            content: 'Risk: Implementation may cause temporary service disruption\nMitigation: Gradual rollout with feature flags and monitoring\n\nRisk: Changes may introduce new issues\nMitigation: Comprehensive QA testing and staged deployment',
            editable: false
          },
          {
            id: 'out-of-scope',
            title: 'Out of Scope',
            content: 'Items not directly related to the selected theme will be addressed in future iterations.',
            editable: false
          },
        ])
      }
    }
  }

  const handleConnectSource = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId)
    setSources(prev => prev.map(s =>
      s.id === sourceId ? { ...s, connected: true, connectedAt: new Date().toISOString() } : s
    ))
    addMessage('assistant', `✅ Successfully connected ${source?.name}! I'll start capturing signals from this source.`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200'
      case 'Completed': return 'bg-gray-800 text-white border-gray-800'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'wibey': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'capture': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'discovery': 'bg-blue-100 text-blue-700 border-blue-200',
      'specification': 'bg-pink-100 text-pink-700 border-pink-200',
      'design': 'bg-orange-100 text-orange-700 border-orange-200',
      'plan': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'build': 'bg-green-100 text-green-700 border-green-200',
      'trace': 'bg-gray-800 text-white border-gray-800',
      'feedback': 'bg-purple-100 text-purple-700 border-purple-200',
    }
    return colors[stage] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getStageLabel = (stage: string) => {
    const labels: { [key: string]: string } = {
      'wibey': 'Wibey',
      'capture': 'Capture',
      'discovery': 'Discovery',
      'specification': 'Specification',
      'design': 'Design',
      'plan': 'Plan',
      'build': 'Build',
      'trace': 'Trace',
      'feedback': 'Feedback',
    }
    return labels[stage] || 'Wibey'
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'slack': return '💬'
      case 'jira': return '📋'
      case 'confluence': return '📚'
      case 'onedrive': return '☁️'
      case 'adobe-analytics': return '📊'
      default: return '🔗'
    }
  }

  return (
      <div className="flex h-screen bg-white">
        {/* Left Sidebar - Chat (45%) */}
        <div className="w-[45%] border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <img src={WibeyLogo} alt="Wibey" className="h-8 w-auto" />
              <h1 className="text-lg font-semibold text-gray-900">Wibey</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                History
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${message.role === 'assistant'
                      ? 'bg-white'
                      : 'bg-gray-700 text-white text-xs font-medium'
                    }`}>
                    {message.role === 'assistant' ? (
                      <img src={WibeyLogo} alt="Wibey" className="w-full h-full object-contain p-1" />
                    ) : 'MK'}
                  </div>

                  <div className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    {message.actionButtons && message.actionButtons.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {message.actionButtons.map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAction(btn.action)}
                            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${btn.primary
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{btn.label}</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            {btn.description && (
                              <p className={`text-xs mt-1 ${btn.primary ? 'text-blue-100' : 'text-gray-500'}`}>
                                {btn.description}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Thought for 15.152 seconds</span>
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={WibeyLogo} alt="Wibey" className="w-full h-full object-contain p-1" />
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

            {currentWorkspace && getNextActionSuggestion(currentWorkspace.lastStage) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900 whitespace-pre-line">
                  {getNextActionSuggestion(currentWorkspace.lastStage)}
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Information Section */}
          {currentWorkspace && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{currentWorkspace.name}</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
              {currentWorkspace.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{currentWorkspace.description}</p>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-end gap-2 mb-2">
              <button
                onClick={() => setShowSources(!showSources)}
                className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              >
                Sources ({sources.filter(s => s.connected).length})
              </button>
            </div>
            <div className="flex items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Enter your question here... (Shift + Return to add new line)"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Canvas
              </button>
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
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                  MK
                </div>
              </div>
              <p className="text-xs text-gray-400">AI-generated responses may be inaccurate and should be validated.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Canvas (55%) */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          {!currentWorkspace || currentWorkspace === null ? (
            // Landing View - Workspace List
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Workspaces</h2>
                <p className="text-sm text-gray-500 mt-1">Select a workspace or create a new one</p>
              </div>


              {/* Workspaces Grid - Including Create New */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Create New Workspace Card */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center h-full flex flex-col items-center justify-center min-h-[180px]"
                >
                  <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="font-semibold text-gray-900 mb-1">Create New Workspace</h3>
                  <p className="text-sm text-gray-500">Start a new initiative</p>
                </button>

                {/* Example Workspaces */}
                {exampleWorkspaces.map((workspace) => {
                  const memberCount = getWorkspaceMembers(workspace.id)
                  return (
                    <div
                      key={workspace.id}
                      onClick={() => handleSelectWorkspace(workspace.id)}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{workspace.name}</h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(workspace.status)}`}>
                          {workspace.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-600">
                          {workspace.signalCount} signals
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-2">
                            {Array.from({ length: Math.min(memberCount, 3) }).map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                          </div>
                          {memberCount > 3 && (
                            <span className="text-xs text-gray-500 ml-1">+{memberCount - 3}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStageColor(workspace.lastStage)}`}>
                          {getStageLabel(workspace.lastStage)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(workspace.lastModified)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              className="text-gray-200"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${workspace.progress * 175.9} 175.9`}
                              className={getProgressColor(workspace.progressColor)}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-sm font-semibold ${getProgressColor(workspace.progressColor)}`}>
                              {Math.round(workspace.progress * 100)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>


              {/* Welcome Message */}
              <div className="mt-12">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                    <img src={WibeyLogo} alt="Wibey" className="w-full h-full object-contain p-3" />
                  </div>
                  <h2 className="text-3xl font-bold text-purple-600 mb-2">Welcome to Wibey</h2>
                  <p className="text-lg text-gray-600">Your AI-powered partner for the complete Product Development Lifecycle</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white rounded-xl border-2 border-blue-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Capture & Synthesize</h3>
                    <p className="text-sm text-gray-600">Connect to Confluence, Jira, Slack, and more. I'll automatically extract insights, identify patterns, and synthesize themes from scattered information.</p>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Generate Specifications</h3>
                    <p className="text-sm text-gray-600">Transform insights into structured PRDs with functional requirements, NFRs, API contracts, and feature flags - all machine-readable and SpecKit compatible.</p>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-green-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Design Automation</h3>
                    <p className="text-sm text-gray-600">Generate UI wireframes, component specs, and system architecture diagrams directly from your specifications using MagicScreen and GenMap.</p>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-orange-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Planning & Build</h3>
                    <p className="text-sm text-gray-600">Auto-generate epics, estimate effort, map dependencies, create code scaffolds, and produce tests - all linked back to your original requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : currentWorkspace ? (
            // Workspace Details View
            <div className="p-6 space-y-6">
              {/* Workspace Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Back Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        saveWorkspace()
                        selectWorkspace(null)
                        setSelectedExampleWorkspace(null)
                      }}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Workspaces
                    </button>

                    {isEditingWorkspace ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editWorkspaceName}
                          onChange={(e) => setEditWorkspaceName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                        />
                        <textarea
                          value={editWorkspaceDescription}
                          onChange={(e) => setEditWorkspaceDescription(e.target.value)}
                          placeholder="Description..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingWorkspace(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">{currentWorkspace.name}</h2>
                          <button
                            onClick={handleEditWorkspace}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                        {currentWorkspace.description && (
                          <p className="text-gray-600 mb-3">{currentWorkspace.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStageColor(currentWorkspace.lastStage)}`}>
                              {getStageLabel(currentWorkspace.lastStage)}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(currentWorkspace.status)}`}>
                              {currentWorkspace.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              Last updated {new Date(currentWorkspace.lastModified).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* People Bubbles */}
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {teamMembers.slice(0, 3).map((member) => {
                                  const colorClasses: Record<string, string> = {
                                    blue: 'bg-blue-600',
                                    purple: 'bg-purple-600',
                                    green: 'bg-green-600',
                                    orange: 'bg-orange-600',
                                  }
                                  return (
                                    <div
                                      key={member.id}
                                      className={`w-8 h-8 ${colorClasses[member.color] || 'bg-gray-600'} text-white rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold`}
                                      title={member.name}
                                    >
                                      {member.initials}
                                    </div>
                                  )
                                })}
                                {teamMembers.length > 3 && (
                                  <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold">
                                    +{teamMembers.length - 3}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => setShowInviteModal(true)}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Invite
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 1. Connect Sources Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Connect Sources</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-10">Link your data sources to capture product signals.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xl">{getSourceIcon(source.type)}</div>
                        {source.connected ? (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConnectSource(source.id)}
                            className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                      <h4 className="text-gray-900 font-medium text-sm mb-0.5">{source.name}</h4>
                      {source.connected && source.connectedAt && (
                        <p className="text-gray-500 text-xs">
                          {new Date(source.connectedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Ad-hoc File Upload - Compact */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <svg className="mx-auto h-6 w-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 text-xs">Drop files or click</p>
                      <p className="text-gray-400 text-xs">PDF, DOCX, XLSX</p>
                    </div>
                    <button
                      onClick={handleStartIngesting}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm whitespace-nowrap"
                    >
                      Start Ingesting
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Signal Analysis Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Signal Analysis</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-10">AI-powered clustering of product signals into actionable themes</p>
                </div>

                {signalAnalysis.analyzed ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Captured Signals</h4>
                        <button
                          onClick={handleAnalyzeSignals}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Re-analyze
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{signalAnalysis.totalSignals}</div>
                          <div className="text-sm text-gray-600">Total Signals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{signalAnalysis.keyThemes}</div>
                          <div className="text-sm text-gray-600">Key Themes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{signalAnalysis.insights}</div>
                          <div className="text-sm text-gray-600">Insights</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">Identified Themes (Click to Select)</h4>
                      <div className="space-y-2">
                        {signalAnalysis.themes.map((theme, idx) => {
                          const isSelected = hypothesis.selectedTheme === `theme-${idx}`
                          return (
                            <button
                              key={idx}
                              onClick={() => handleThemeSelect(idx)}
                              className={`w-full flex items-center justify-between bg-white p-3 rounded-lg border-2 transition-all hover:border-blue-300 hover:shadow-sm ${
                                isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent'
                              }`}
                            >
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{theme.name}</span>
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{theme.signals} signals, {theme.priority}</span>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${theme.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                  theme.status === 'High' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {theme.status}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-3">✨</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Signals Yet</h4>
                    <p className="text-sm text-gray-500">Connect sources and ingest signals to enable analysis.</p>
                  </div>
                )}
              </div>

              {/* 3. Hypothesis Formation Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Hypothesis Formation</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-10">Define your problem statement and hypothesis</p>
                </div>

                {hypothesis.themeLocked || signalAnalysis.analyzed ? (
                  <div className="space-y-4">
                    {hypothesis.selectedTheme && signalAnalysis.themes.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-sm font-medium text-blue-900">
                              Selected Theme: {signalAnalysis.themes[parseInt(hypothesis.selectedTheme.replace('theme-', ''))]?.name}
                            </div>
                            <div className="text-xs text-blue-700">
                              {signalAnalysis.themes[parseInt(hypothesis.selectedTheme.replace('theme-', ''))]?.signals} signals
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAction('change-theme')}
                          className="text-xs text-blue-700 hover:text-blue-900 font-medium underline"
                        >
                          Change Theme
                        </button>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Problem Statement</h4>
                      <textarea
                        value={hypothesis.problemStatement}
                        onChange={(e) => setHypothesis(prev => ({ ...prev, problemStatement: e.target.value }))}
                        placeholder="Enter your problem statement..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={4}
                      />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Hypothesis</h4>
                      <textarea
                        value={hypothesis.hypothesis}
                        onChange={(e) => setHypothesis(prev => ({ ...prev, hypothesis: e.target.value }))}
                        placeholder="Enter your hypothesis..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={4}
                      />
                    </div>
                    {hypothesis.themeLocked && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Hypothesis formed - Ready for PRD generation
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-3">💡</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Theme Selected</h4>
                    <p className="text-sm text-gray-500">Lock a theme cluster to begin hypothesis formation.</p>
                  </div>
                )}
              </div>

              {/* 4. PRD Generation Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">PRD Generation</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-10">AI-generated PRD with professional layout</p>
                </div>

                {hypothesis.themeLocked && prdSections.length > 0 && prdSections[0].content ? (
                  <div className="flex gap-6 h-[600px]">
                    {/* Table of Contents - Left Sidebar */}
                    <div className="w-64 border-r border-gray-200 pr-4 overflow-y-auto">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">TABLE OF CONTENTS</h4>
                      <ol className="space-y-2">
                        {prdSections.map((section, idx) => (
                          <li key={section.id}>
                            <button
                              onClick={() => setSelectedPrdSection(section.id)}
                              className={`text-left text-sm w-full px-2 py-1.5 rounded transition-colors ${selectedPrdSection === section.id
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                              {idx + 1}. {section.title}
                            </button>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Document Content - Right Side */}
                    <div className="flex-1 overflow-y-auto pr-4">
                      {/* Document Header */}
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500">Version v1.0</div>
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-gray-500">{currentWorkspace?.owner || 'Sarah Chen'}</div>
                            <div className="text-xs text-gray-500">Last modified {new Date(currentWorkspace?.lastModified || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">Product Requirements Document</h2>
                            {hypothesis.selectedTheme && signalAnalysis.themes.length > 0 && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">Based on theme:</span>
                                <span className="text-xs font-medium text-blue-700">
                                  {signalAnalysis.themes.find((_, idx) => hypothesis.selectedTheme === `theme-${idx}`)?.name || 'Selected theme'}
                                </span>
                              </div>
                            )}
                          </div>
                          {editingPrdSection === selectedPrdSection ? (
                            <button
                              onClick={() => {
                                setEditingPrdSection(null)
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingPrdSection(selectedPrdSection)}
                              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            Draft
                          </span>
                          {hypothesis.selectedTheme && signalAnalysis.themes.length > 0 && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${signalAnalysis.themes.find((_, idx) => hypothesis.selectedTheme === `theme-${idx}`)?.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                signalAnalysis.themes.find((_, idx) => hypothesis.selectedTheme === `theme-${idx}`)?.status === 'High' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-blue-100 text-blue-700'
                              }`}>
                              {signalAnalysis.themes.find((_, idx) => hypothesis.selectedTheme === `theme-${idx}`)?.priority || ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Selected Section Content */}
                      {prdSections.find(s => s.id === selectedPrdSection) && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {prdSections.findIndex(s => s.id === selectedPrdSection) + 1}. {prdSections.find(s => s.id === selectedPrdSection)?.title}
                          </h3>
                          {editingPrdSection === selectedPrdSection ? (
                            <textarea
                              value={prdSections.find(s => s.id === selectedPrdSection)?.content || ''}
                              onChange={(e) => {
                                setPrdSections(prev => prev.map(s =>
                                  s.id === selectedPrdSection ? { ...s, content: e.target.value } : s
                                ))
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[300px]"
                              rows={12}
                            />
                          ) : (
                            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                              {prdSections.find(s => s.id === selectedPrdSection)?.content}
                            </div>
                          )}

                          {/* Links for Problem Statement section */}
                          {selectedPrdSection === 'problem' && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm underline">Jira: MOBILE-1234</a>
                              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm underline">Analytics Dashboard</a>
                              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm underline">User Research Report</a>
                            </div>
                          )}

                          {/* Table for Goals & Success Metrics */}
                          {selectedPrdSection === 'goals' && (
                            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Metric</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Current</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Target</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  <tr>
                                    <td className="px-4 py-2 text-gray-700">Cart Abandonment Rate</td>
                                    <td className="px-4 py-2 text-gray-600">68%</td>
                                    <td className="px-4 py-2 text-gray-900 font-medium">&lt;40%</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2 text-gray-700">Payment Page Load Time</td>
                                    <td className="px-4 py-2 text-gray-600">2.8s P95</td>
                                    <td className="px-4 py-2 text-gray-900 font-medium">&lt;1.5s P95</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2 text-gray-700">Promo Code Success Rate</td>
                                    <td className="px-4 py-2 text-gray-600">55%</td>
                                    <td className="px-4 py-2 text-gray-900 font-medium">&gt;90%</td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-2 text-gray-700">Mobile Conversion Rate</td>
                                    <td className="px-4 py-2 text-gray-600">12%</td>
                                    <td className="px-4 py-2 text-gray-900 font-medium">&gt;15%</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-3">📄</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">PRD Not Available</h4>
                    <p className="text-sm text-gray-500">Complete hypothesis formation to generate a PRD.</p>
                  </div>
                )}
              </div>

              {/* 5. Review & Approval Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Review & Approval</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-10">Share PRD with stakeholders, collect feedback, and get approvals</p>
                </div>

                {hypothesis.themeLocked && prdSections.length > 0 && prdSections[0].content ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Reviewers</h4>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {teamMembers.map((member) => {
                          const colorClasses: Record<string, string> = {
                            blue: 'bg-blue-600',
                            purple: 'bg-purple-600',
                            green: 'bg-green-600',
                            orange: 'bg-orange-600',
                          }
                          return (
                            <div key={member.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                              <div className={`w-8 h-8 ${colorClasses[member.color] || 'bg-gray-600'} text-white rounded-full flex items-center justify-center text-xs font-semibold`}>
                                {member.initials}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.role}</div>
                              </div>
                            </div>
                          )
                        })}
                        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Reviewer
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Approval Status</h4>
                      <div className="space-y-2">
                        {handoffStatus.map((status) => (
                          <div
                            key={status.id}
                            className={`flex items-center justify-between rounded-lg p-3 border ${status.status === 'completed' ? 'bg-green-50 border-green-200' :
                                status.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                                  'bg-gray-50 border-gray-200'
                              }`}
                          >
                            <div>
                              <span className="font-medium text-gray-900">{status.name}</span>
                              <span className="ml-2 text-xs text-gray-500">{status.description}</span>
                            </div>
                            <span className={`px-2 py-1 text-white text-xs font-medium rounded ${status.status === 'completed' ? 'bg-green-600' :
                                status.status === 'in-progress' ? 'bg-blue-600' :
                                  'bg-gray-400'
                              }`}>
                              {status.status === 'completed' ? 'Approved' :
                                status.status === 'in-progress' ? 'In Review' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Share PRD</h4>
                      <p className="text-sm text-blue-800 mb-3">Share this PRD with stakeholders for review and feedback</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                          Generate Share Link
                        </button>
                        <button className="px-4 py-2 bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 text-sm">
                          Export PDF
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleHandoffToEngineering}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Request Approval
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                        Send to Engineering
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-3">📋</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">PRD Not Ready</h4>
                    <p className="text-sm text-gray-500">Complete PRD generation to enable review and approval workflow.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading workspace...</p>
            </div>
          )}
        </div>

        {/* Create Workspace Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Create New Workspace</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace Name *
                  </label>
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="e.g., Customer Checkout Optimization"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newWorkspaceDescription}
                    onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                    placeholder="Brief description of this workspace..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewWorkspaceName('')
                    setNewWorkspaceDescription('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  disabled={!newWorkspaceName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
                <button
                  onClick={() => {
                    setShowInviteModal(false)
                    setInviteEmail('')
                    setInviteRole('Editor')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="role"
                        value="Editor"
                        checked={inviteRole === 'Editor'}
                        onChange={(e) => setInviteRole(e.target.value as 'Editor' | 'Viewer')}
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Editor</div>
                        <div className="text-xs text-gray-500">Can edit workspace and collaborate</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="role"
                        value="Viewer"
                        checked={inviteRole === 'Viewer'}
                        onChange={(e) => setInviteRole(e.target.value as 'Editor' | 'Viewer')}
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Viewer</div>
                        <div className="text-xs text-gray-500">Can view workspace only</div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      if (inviteEmail.trim()) {
                        // Add to team members (in a real app, this would send an invite)
                        addMessage('assistant', `✅ Invitation sent to ${inviteEmail} as ${inviteRole}! They'll receive an email with access to this workspace.`)
                        setShowInviteModal(false)
                        setInviteEmail('')
                        setInviteRole('Editor')
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Send Invitation
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteModal(false)
                      setInviteEmail('')
                      setInviteRole('Editor')
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}