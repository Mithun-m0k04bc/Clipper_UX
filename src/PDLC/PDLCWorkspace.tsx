import { useState, useRef, useEffect } from 'react'
import WibeyLogo from '../assets/wibey-logo.svg'
import { Download, Brain, Sparkles, FileText, Palette, Calendar, Hammer, BarChart3, Lightbulb, Link as LinkIcon, Target, Shield, Workflow } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  actionButtons?: { label: string; action: string; primary?: boolean }[]
}

type WorkflowStep = 
  | 'capture'
  | 'reason'
  | 'synthesize'
  | 'spec'
  | 'design'
  | 'plan'
  | 'build'
  | 'trace'
  | 'learn'

interface WorkspaceUser {
  name: string
  email: string
  role: 'Owner' | 'Editor' | 'Viewer'
}

export default function PDLCWorkspace() {
  const [currentUser] = useState<WorkspaceUser>({ name: 'You', email: 'pm@company.com', role: 'Owner' })
  const [workspaceName, setWorkspaceName] = useState('New Project')
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('capture')
  const [sourcesShared, setSourcesShared] = useState(false)
  const [collaborators, setCollaborators] = useState<WorkspaceUser[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm Wibey, your AI partner for the Product Development Lifecycle.

I help transform scattered signals into shipped features with full traceability – from initial ideas to production deployment.

Share your Confluence docs, Jira tickets, or Slack threads to get started.`,
      timestamp: new Date(),
      actionButtons: [
        { label: '📎 Share links & documents', action: 'share-links', primary: true },
      ]
    }
  ])
  
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollCanvasToTop = () => {
    canvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string, actionButtons?: any[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      timestamp: new Date(),
      actionButtons,
    }])
  }

  const handleAddCollaborator = (email: string, role: 'Editor' | 'Viewer') => {
    if (!email.trim()) return
    setCollaborators(prev => [...prev, {
      name: email.split('@')[0],
      email,
      role,
    }])
  }

  const handleAction = (action: string) => {
    if (action === 'share-links') {
      addMessage('user', 'Here are the sources:\n• Confluence: Mobile Checkout PRD\n• Jira: MOBILE-1234\n• Slack: #checkout-team')
      setSourcesShared(true)
      scrollCanvasToTop()
      setTimeout(() => {
        addMessage('system', '🔄 Analyzing 3 sources...')
        setTimeout(() => {
          addMessage('assistant', 'Successfully captured data from 3 sources! I found 47 insights across Confluence, Jira, and Slack.\n\nReady to analyze and extract key themes?', [
            { label: '🧠 Analyze & Reason', action: 'reason', primary: true },
          ])
        }, 1500)
      }, 1000)
    } else if (action === 'reason') {
      addMessage('user', 'Analyze the sources and extract key insights.')
      setTimeout(() => {
        setCurrentStep('reason')
        scrollCanvasToTop()
        addMessage('assistant', 'I\'ve analyzed all sources and identified 3 key themes:\n\n1. Payment timeouts (34 signals, P0)\n2. Promo code UX issues (18 signals, P1)\n3. Localization gaps (11 signals, P2)\n\nReady to synthesize?', [
          { label: '✨ Synthesize', action: 'synthesize', primary: true },
        ])
      }, 1000)
    } else if (action === 'synthesize') {
      addMessage('user', 'Yes, synthesize everything.')
      setTimeout(() => {
        setCurrentStep('synthesize')
        scrollCanvasToTop()
        addMessage('assistant', '**Synthesis Complete!**\n\n**Problem:** 68% cart abandonment on mobile checkout\n**Solution:** Reduce payment timeout + add promo fallback\n**Target:** 40% abandonment rate\n**Markets:** IN, CA, MX\n\nReady to generate spec?', [
          { label: '📋 Generate Spec', action: 'generate-spec', primary: true },
        ])
      }, 1000)
    } else if (action === 'generate-spec') {
      addMessage('user', 'Generate the specification.')
      setTimeout(() => {
        setCurrentStep('spec')
        scrollCanvasToTop()
        addMessage('assistant', '**✅ Spec Generated (v1.0)**\n\n• 12 functional requirements\n• 8 NFRs (performance, security, locale)\n• 24 acceptance criteria\n• 3 API contracts\n\nReady for design?', [
          { label: '🎨 Generate Design', action: 'generate-design', primary: true },
        ])
      }, 1000)
    } else if (action === 'generate-design') {
      addMessage('user', 'Generate design.')
      setTimeout(() => {
        setCurrentStep('design')
        scrollCanvasToTop()
        addMessage('assistant', '**✅ Design Generated**\n\n5 screens created with component specs.\n\nReady to plan?', [
          { label: '📅 Generate Plan', action: 'generate-plan', primary: true },
        ])
      }, 1000)
    } else if (action === 'generate-plan') {
      addMessage('user', 'Generate plan.')
      setTimeout(() => {
        setCurrentStep('plan')
        scrollCanvasToTop()
        addMessage('assistant', '**✅ Plan Generated**\n\n3 epics, 4 sprints, 6 weeks.\n\nReady to build?', [
          { label: '🔨 Execute Build', action: 'execute-build', primary: true },
        ])
      }, 1000)
    } else if (action === 'execute-build') {
      addMessage('user', 'Execute AIDLC.')
      setTimeout(() => {
        setCurrentStep('build')
        scrollCanvasToTop()
        addMessage('assistant', '**✅ Build Complete**\n\n• 1,856 lines of code\n• 47 tests (100% pass)\n• 3 PRs ready\n\nView audit?', [
          { label: '📊 View Trace', action: 'view-trace', primary: true },
        ])
      }, 1000)
    } else if (action === 'view-trace') {
      addMessage('user', 'Show audit trail.')
      setTimeout(() => {
        setCurrentStep('trace')
        scrollCanvasToTop()
        addMessage('assistant', '**✅ Audit Complete**\n\nFull traceability established.\n\nView feedback?', [
          { label: '💡 View Feedback', action: 'view-feedback', primary: true },
        ])
      }, 1000)
    } else if (action === 'view-feedback') {
      addMessage('user', 'Show feedback.')
      setTimeout(() => {
        setCurrentStep('learn')
        scrollCanvasToTop()
        addMessage('assistant', '**💡 Feedback Analysis**\n\n• Cart abandonment: 68% → 43%\n• 3 new initiatives identified\n\nStart new cycle?', [
          { label: '🔄 New Initiative', action: 'new-initiative', primary: true },
        ])
      }, 1000)
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const steps = [
    { id: 'capture', label: 'Capture', icon: Download },
    { id: 'reason', label: 'Reason', icon: Brain },
    { id: 'synthesize', label: 'Synthesize', icon: Sparkles },
    { id: 'spec', label: 'Spec', icon: FileText },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'build', label: 'Build', icon: Hammer },
    { id: 'trace', label: 'Trace', icon: BarChart3 },
    { id: 'learn', label: 'Learn', icon: Lightbulb },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const renderCanvas = () => {
    const canvasContent: Record<string, any> = {
      capture: {
        title: 'Captured Sources',
        items: [
          { 
            name: 'Mobile Checkout PRD', 
            type: 'Confluence', 
            insights: 12, 
            owner: 'Sarah Chen', 
            modified: '2 days ago',
            url: 'https://confluence.company.com/checkout-prd',
            preview: 'Problem: Our mobile checkout conversion rate is 32% lower than desktop. Users abandon at the payment step...',
            tags: ['checkout', 'mobile', 'payments', 'IN-market'],
            sections: [
              { title: 'Problem Statement', excerpt: '68% cart abandonment on mobile at payment step, primarily in India market' },
              { title: 'Current State', excerpt: 'Payment Service v3 showing 2.8s P95 latency, promo validation failures at 45%' },
              { title: 'Proposed Solution', excerpt: 'Optimize payment API, add promo fallback messaging, improve localization' },
            ]
          },
          { 
            name: 'MOBILE-1234: Cart Abandonment Investigation', 
            type: 'Jira', 
            insights: 8, 
            owner: 'Mike Rodriguez', 
            modified: '5 days ago',
            url: 'https://jira.company.com/MOBILE-1234',
            status: 'In Progress',
            priority: 'P0',
            preview: 'After analyzing checkout funnel metrics, we found payment timeout is the #1 cause of abandonment...',
            tags: ['bug', 'performance', 'payments'],
            comments: [
              { author: 'Mike Rodriguez', text: 'Payment service timeout increased from 1.2s to 2.8s after v3 migration', timestamp: '3 days ago' },
              { author: 'Lisa Wang', text: 'Also seeing 45% promo code validation failures during peak hours', timestamp: '2 days ago' },
            ],
            linkedIssues: ['MOBILE-1235', 'MOBILE-1236', 'PAY-567']
          },
          { 
            name: '#checkout-team discussion', 
            type: 'Slack', 
            insights: 27, 
            owner: 'Checkout Team', 
            modified: '1 day ago',
            url: 'https://company.slack.com/archives/checkout-team',
            channel: '#checkout-team',
            messageCount: 147,
            preview: 'Sarah: We need to prioritize the mobile checkout fixes. Mike: Agreed, payment timeouts are killing us...',
            tags: ['urgent', 'mobile', 'payments'],
            keyMessages: [
              { author: 'Sarah Chen', text: 'Payment timeout is now our #1 support ticket. 2,340 tickets last week alone.', reactions: 12, timestamp: '2 days ago' },
              { author: 'Mike Rodriguez', text: 'IN market is worst affected - 78% abandonment vs 58% in US/CA', reactions: 8, timestamp: '2 days ago' },
              { author: 'Lisa Wang', text: 'Promo engine team can deliver fallback messaging in 1 sprint', reactions: 15, timestamp: '1 day ago' },
              { author: 'Alex Kumar', text: 'Hindi error messages are completely missing, showing English by default', reactions: 6, timestamp: '1 day ago' },
            ]
          },
        ]
      },
      reason: {
        title: 'Key Insights from Sources',
        type: 'highlights',
        sources: [
          {
            name: 'Confluence: Mobile Checkout PRD',
            highlights: [
              { text: '68% cart abandonment rate at payment step', type: 'metric', severity: 'critical' },
              { text: 'Payment Service v3 latency increased from 1.2s to 2.8s P95', type: 'technical', severity: 'high' },
              { text: 'India market most affected with 78% abandonment', type: 'market', severity: 'critical' },
            ]
          },
          {
            name: 'Jira: MOBILE-1234',
            highlights: [
              { text: 'Promo validation failures at 45% during peak hours', type: 'bug', severity: 'high' },
              { text: '3 linked payment infrastructure tickets', type: 'dependency', severity: 'medium' },
              { text: 'Mobile web checkout slower than native app by 3x', type: 'performance', severity: 'high' },
            ]
          },
          {
            name: 'Slack: #checkout-team',
            highlights: [
              { text: '2,340 support tickets last week for payment timeout', type: 'customer', severity: 'critical' },
              { text: 'Hindi error messages completely missing', type: 'localization', severity: 'high' },
              { text: 'Promo team can deliver fallback in 1 sprint', type: 'opportunity', severity: 'medium' },
            ]
          }
        ],
        summary: {
          themes: [
            { theme: 'Payment Timeout Issues', signals: 34, priority: 'P0' },
            { theme: 'Promo Code UX Problems', signals: 18, priority: 'P1' },
            { theme: 'Localization Gaps', signals: 11, priority: 'P2' },
          ]
        }
      },
      synthesize: {
        title: 'Synthesis & Validation',
        type: 'structured',
        problemStatement: {
          title: 'Validated Problem Statement',
          content: 'Mobile checkout experiences 68% cart abandonment at the payment step, primarily in the India market (78% abandonment). Root cause is Payment Service v3 timeout (2.8s P95 latency) combined with unclear promo code error messaging and missing Hindi localization.'
        },
        jobsToBeDone: {
          title: 'Jobs-to-be-Done',
          jobs: [
            'When I\'m ready to pay, I want checkout to feel instant and trustworthy so I don\'t abandon my cart.',
            'When a promo code fails, I want clear explanation and a safe fallback so I don\'t lose trust.',
            'When I see an error, I want it in my language so I understand what went wrong.',
          ]
        },
        hypothesis: {
          title: 'Early Hypothesis Statements',
          statements: [
            'Reducing payment API latency to <1.5s will decrease abandonment by 20%',
            'Adding explicit promo fallback messaging will reduce promo-related support tickets by 50%',
            'Hindi error messages will improve IN market conversion by 15%',
          ]
        },
        userJourneys: {
          title: 'Emerging User Journeys',
          journeys: [
            { step: 'Cart Review', pain: 'None identified', opportunity: 'Optimize for speed' },
            { step: 'Payment Entry', pain: '2.8s load time causes anxiety', opportunity: 'Reduce to <1.5s' },
            { step: 'Promo Application', pain: 'Silent failures confuse users', opportunity: 'Clear messaging' },
            { step: 'Payment Confirmation', pain: 'Timeout errors in English only', opportunity: 'Localize errors' },
          ]
        },
        acceptanceCriteria: {
          title: 'Early Acceptance Criteria',
          criteria: [
            'Payment page loads in <1.5s (P95) on 3G connections',
            'Promo code errors display user-friendly messages with fallback options',
            'All error messages available in Hindi, English, French, Spanish',
            'Cart abandonment drops below 50% within 2 weeks of launch',
            'Support tickets for payment issues reduce by 40%',
          ]
        },
        dependencies: {
          title: 'Known Dependencies',
          items: [
            { type: 'Team', name: 'Payment Service Team', dependency: 'API optimization for <1.5s response' },
            { type: 'Team', name: 'Promo Engine Team', dependency: 'Fallback messaging implementation' },
            { type: 'Team', name: 'Localization Team', dependency: 'Hindi/French/Spanish translations' },
            { type: 'System', name: 'Payment Service v3', dependency: 'Timeout configuration, retry logic' },
            { type: 'System', name: 'Promo Engine', dependency: 'Validation endpoints, error codes' },
            { type: 'API', name: '/api/v3/payment/process', dependency: 'Performance tuning required' },
            { type: 'API', name: '/api/promo/validate', dependency: 'Enhanced error responses' },
          ]
        },
        uncertaintyAreas: {
          title: 'Uncertainty Areas Requiring Discovery',
          areas: [
            { area: 'Payment Service Optimization', question: 'Can we achieve <1.5s without major infrastructure changes?', impact: 'High' },
            { area: 'Promo Fallback UX', question: 'What fallback options are acceptable to users?', impact: 'Medium' },
            { area: 'Localization Coverage', question: 'Are there other markets needing localization beyond IN/CA/MX?', impact: 'Medium' },
            { area: 'Mobile Device Performance', question: 'Do low-end Android devices need special handling?', impact: 'High' },
          ]
        }
      },
      spec: {
        title: 'Product Requirements Document',
        type: 'prd',
        version: 'v1.0',
        lastModified: 'Dec 11, 2025',
        author: 'Sarah Chen',
        sections: [
          {
            title: '1. Executive Summary',
            content: 'This PRD outlines the requirements for reducing mobile checkout cart abandonment from 68% to <40% by addressing payment timeout issues and promo code UX confusion across IN, CA, and MX markets.'
          },
          {
            title: '2. Problem Statement',
            content: 'Current mobile checkout flow experiences 68% cart abandonment at the payment step. Root cause analysis reveals:\n• Payment Service v3 timeout (2.8s P95 latency)\n• Unclear promo code error messaging\n• Missing localization for error states',
            links: ['Jira: MOBILE-1234', 'Analytics Dashboard', 'User Research Report']
          },
          {
            title: '3. Goals & Success Metrics',
            content: 'Primary Goal: Reduce cart abandonment from 68% to <40%',
            metrics: [
              { metric: 'Cart Abandonment Rate', current: '68%', target: '<40%' },
              { metric: 'Payment Page Load Time', current: '2.8s P95', target: '<1.5s P95' },
              { metric: 'Promo Code Success Rate', current: '55%', target: '>90%' },
              { metric: 'Mobile Conversion Rate', current: '12%', target: '>15%' }
            ]
          },
          {
            title: '4. User Personas & Journeys',
            personas: [
              { name: 'Deal Hunter', description: 'Price-sensitive shopper using promo codes', segment: 'Frequent buyers, high cart value' },
              { name: 'Loyal Customer', description: 'Returning customer with saved payment methods', segment: 'Repeat purchases, trust established' },
              { name: 'New Guest', description: 'First-time mobile checkout user', segment: 'High abandonment risk, needs guidance' }
            ],
            primaryFlows: [
              'Happy Path: Cart → Checkout → Payment → Confirmation (Target: <30s)',
              'Saved Card Flow: Cart → One-Click Payment → Confirmation (Target: <10s)',
              'Promo Flow: Cart → Apply Promo → Checkout → Payment (Target: <35s)',
            ],
            alternativeFlows: [
              'Guest Checkout: Skip login, express checkout flow',
              'Retry Payment: Failed payment → Alternative method → Success',
              'Promo Fallback: Invalid promo → Clear error → Proceed without promo',
            ],
            edgeCases: [
              { case: 'Payment service timeout', handling: 'Retry 3x with exponential backoff, show friendly error' },
              { case: 'Promo expired mid-checkout', handling: 'Auto-remove, notify user, offer alternative' },
              { case: 'Session expired', handling: 'Preserve cart, re-authenticate, restore state' },
              { case: 'Low connectivity', handling: 'Offline-first cart, queue payment when online' },
            ],
            featureBoundaries: {
              inScope: ['Mobile web checkout', 'Saved cards', 'Promo fallback', 'Hindi/French/Spanish localization', 'IN/CA/MX markets'],
              outOfScope: ['PayPal integration (Phase 2)', 'Cryptocurrency payments', 'Guest checkout optimization', 'UK/AU markets', 'Native app changes']
            },
            risks: [
              { risk: 'Payment Service v3 cannot meet <1.5s target', mitigation: 'Parallel work on v4 architecture', impact: 'High' },
              { risk: 'Promo Engine team bandwidth constrained', mitigation: 'Prioritize fallback messaging only', impact: 'Medium' },
              { risk: 'Hindi translations delayed', mitigation: 'Launch IN with English, follow up', impact: 'Medium' },
            ],
            businessOutcomes: [
              { outcome: 'Cart abandonment', current: '68%', target: '<40%', timeline: '4 weeks post-launch' },
              { outcome: 'Mobile conversion rate', current: '12%', target: '>15%', timeline: '4 weeks post-launch' },
              { outcome: 'Support ticket reduction', current: '2,340/week', target: '<1,400/week', timeline: '2 weeks post-launch' },
              { outcome: 'IN market revenue', current: '$2.4M/month', target: '$3.5M/month', timeline: '8 weeks post-launch' },
            ]
          },
          {
            title: '5. Functional Requirements',
            requirements: [
              { id: 'FR-1', title: 'Reduce Payment API Timeout', priority: 'P0', description: 'Optimize Payment Service v3 to respond within 1.5s P95' },
              { id: 'FR-2', title: 'Promo Fallback Messaging', priority: 'P0', description: 'Display clear error and fallback when promo fails' },
              { id: 'FR-3', title: 'Multi-locale Error Messages', priority: 'P1', description: 'Support Hindi, French, Spanish error messages' },
              { id: 'FR-4', title: 'Saved Card Carousel', priority: 'P1', description: 'Quick access to saved payment methods' },
              { id: 'FR-5', title: 'One-Click Checkout', priority: 'P2', description: 'Single-tap purchase for returning users' }
            ]
          },
          {
            title: '6. Non-Functional Requirements',
            nfrs: [
              { category: 'Performance', requirement: 'Page load <1.5s (P50), <2.5s (P95) on 3G' },
              { category: 'Availability', requirement: '99.9% uptime, max 4hrs downtime/month' },
              { category: 'Scalability', requirement: 'Handle 10,000 concurrent checkouts' },
              { category: 'Security', requirement: 'PCI DSS Level 1 compliance' },
              { category: 'Localization', requirement: 'Support IN (Hindi), CA (English/French), MX (Spanish)' },
              { category: 'Accessibility', requirement: 'WCAG 2.1 AA compliance' }
            ]
          },
          {
            title: '7. API Contracts & Dependencies',
            apis: [
              { service: 'Payment Service v3', endpoint: '/api/v3/payment/process', timeout: '1.5s', owner: 'Payments Team' },
              { service: 'Promo Engine', endpoint: '/api/promo/validate', timeout: '500ms', owner: 'Promo Team' },
              { service: 'Localization Service', endpoint: '/api/i18n/translate', timeout: '200ms', owner: 'Platform Team' }
            ]
          },
          {
            title: '8. Feature Flags & Rollout',
            flags: [
              { flag: 'checkout_v2_experience', default: 'OFF', rollout: 'Gradual by tenant, starting IN' },
              { flag: 'promo_fallback_messaging', default: 'OFF', rollout: 'All markets simultaneously' },
              { flag: 'one_click_checkout', default: 'OFF', rollout: 'Phase 2 (post-MVP)' }
            ]
          },
          {
            title: '9. Out of Scope',
            items: ['PayPal integration (Phase 2)', 'Cryptocurrency payment (Future)', 'Guest checkout optimization (separate initiative)']
          }
        ]
      },
      design: {
        title: 'MagicScreen UI/UX Designs',
        type: 'wireframes',
        screens: [
          { 
            name: 'Cart Summary', 
            components: ['Header', 'Cart Items List', 'Promo Input', 'Checkout CTA'],
            wireframe: {
              sections: [
                { type: 'header', label: 'Shopping Cart' },
                { type: 'list', label: 'Items (3)', height: 'auto' },
                { type: 'input', label: 'Promo Code' },
                { type: 'summary', label: 'Subtotal: $124.99' },
                { type: 'button', label: 'Proceed to Checkout', primary: true }
              ]
            },
            interactions: ['Swipe to remove item', 'Tap promo to apply', 'Pull to refresh']
          },
          { 
            name: 'Checkout Entry', 
            components: ['Address Form', 'Delivery Options', 'Continue Button'],
            wireframe: {
              sections: [
                { type: 'header', label: 'Delivery Address' },
                { type: 'form', label: 'Shipping Details', fields: ['Name', 'Address', 'City', 'Postal Code'] },
                { type: 'radio-group', label: 'Delivery Speed', options: ['Standard (Free)', 'Express ($9.99)'] },
                { type: 'button', label: 'Continue to Payment', primary: true }
              ]
            },
            interactions: ['Auto-fill saved address', 'Validate postal code']
          },
          { 
            name: 'Payment Selection', 
            components: ['Payment Methods', 'Card Input', 'Security Badge'],
            wireframe: {
              sections: [
                { type: 'header', label: 'Payment Method' },
                { type: 'carousel', label: 'Saved Cards', count: 2 },
                { type: 'divider', label: 'OR' },
                { type: 'card-input', label: 'New Card', fields: ['Card Number', 'Expiry', 'CVV'] },
                { type: 'checkbox', label: 'Save for future' },
                { type: 'security', label: '🔒 Secure Payment' },
                { type: 'button', label: 'Pay $124.99', primary: true }
              ]
            },
            interactions: ['Swipe through saved cards', 'Real-time card validation', 'Show CVV tooltip']
          },
          { 
            name: 'Payment Processing', 
            components: ['Loading State', 'Progress Indicator'],
            wireframe: {
              sections: [
                { type: 'spinner', label: 'Processing Payment...' },
                { type: 'text', label: 'Please wait, do not close' }
              ]
            },
            states: ['Loading', 'Success', 'Error', 'Timeout']
          },
          { 
            name: 'Order Complete', 
            components: ['Success Message', 'Order Summary', 'Track Order CTA'],
            wireframe: {
              sections: [
                { type: 'icon', label: '✓', color: 'green' },
                { type: 'header', label: 'Order Confirmed!' },
                { type: 'text', label: 'Order #12345678' },
                { type: 'summary', label: 'Arriving Dec 15-17' },
                { type: 'button', label: 'Track Order', primary: true },
                { type: 'button', label: 'Continue Shopping', secondary: true }
              ]
            },
            interactions: ['Share order link', 'Add to calendar']
          },
        ]
      },
      plan: {
        title: 'Smart Planning & Guidance',
        type: 'workflow',
        dependencyResolution: {
          title: 'Dependency Resolution',
          dependencies: [
            { from: 'Checkout UI', to: 'Payment Service v3', type: 'API', status: 'Resolved', details: 'Payment API contract finalized, <1.5s target agreed' },
            { from: 'Checkout UI', to: 'Promo Engine', type: 'Service', status: 'Resolved', details: 'Fallback messaging endpoints ready' },
            { from: 'Promo Engine', to: 'Localization', type: 'Translation', status: 'In Progress', details: 'Hindi strings pending approval' },
            { from: 'All Teams', to: 'Platform', type: 'Infrastructure', status: 'Blocked', details: 'CDN configuration needs approval' },
          ]
        },
        sequencing: {
          title: 'Work Sequencing',
          sequence: [
            { order: 1, work: 'Payment Service v3 optimization', rationale: 'Foundational performance work, blocks all else', duration: '2 sprints' },
            { order: 2, work: 'Promo fallback messaging (parallel)', rationale: 'Independent of payment work, can run concurrently', duration: '1 sprint' },
            { order: 3, work: 'Checkout UI integration', rationale: 'Depends on payment & promo completion', duration: '2 sprints' },
            { order: 4, work: 'Localization rollout', rationale: 'Can overlay on completed UI', duration: '1 sprint' },
          ]
        },
        sizing: {
          title: 'Sizing Inputs',
          epics: [
            { id: 'EPIC-1', name: 'IN Mobile Checkout v2', team: 'Checkout UI', effort: 'L', points: 16, confidence: 'Medium', assumptions: 'Payment API delivers on time' },
            { id: 'EPIC-2', name: 'Promo Fallback Flow', team: 'Promo Engine', effort: 'M', points: 10, confidence: 'High', assumptions: 'No new promo edge cases discovered' },
            { id: 'EPIC-3', name: 'Multi-locale Errors', team: 'Localization', effort: 'S', points: 8, confidence: 'High', assumptions: 'Hindi translations ready' },
          ],
          totalPoints: 34,
          velocity: '8-10 points/sprint',
          estimatedDuration: '4 sprints (6 weeks)'
        },
        riskEvaluation: {
          title: 'Risk & Uncertainty Evaluation',
          risks: [
            { risk: 'Payment Service v3 performance target miss', probability: 'Medium', impact: 'High', mitigation: 'Start v4 architecture in parallel, plan fallback' },
            { risk: 'Promo Engine bandwidth constraints', probability: 'Low', impact: 'Medium', mitigation: 'Pre-commit resources, escalate if needed' },
            { risk: 'Cross-team coordination delays', probability: 'Medium', impact: 'Medium', mitigation: 'Weekly sync meetings, shared Slack channel' },
          ]
        },
        tollgates: {
          title: 'Tollgates & Milestones',
          gates: [
            { gate: 'Gate 1: Spec Review', criteria: 'PRD approved by PM, Eng, Design', status: 'Complete', date: 'Week 1' },
            { gate: 'Gate 2: Design Review', criteria: 'Wireframes + architecture approved', status: 'Pending', date: 'Week 2' },
            { gate: 'Gate 3: Dev Complete', criteria: 'All code merged, tests pass', status: 'Not Started', date: 'Week 5' },
            { gate: 'Gate 4: Go/No-Go', criteria: 'Performance targets met, compliance check', status: 'Not Started', date: 'Week 6' },
          ]
        },
        readinessChecks: {
          title: 'Readiness Checks',
          checks: [
            { check: 'Payment Service v3 performance', target: '<1.5s P95 latency', current: '2.8s', status: 'Not Ready', owner: 'Payment Team' },
            { check: 'Promo fallback endpoints', target: 'API live + tested', current: 'In development', status: 'On Track', owner: 'Promo Team' },
            { check: 'Hindi translations', target: '100% coverage', current: '85% complete', status: 'At Risk', owner: 'Localization Team' },
            { check: 'QA environment ready', target: 'Full IN market config', current: 'Partial', status: 'Not Ready', owner: 'Platform Team' },
          ]
        },
        handoffs: {
          title: 'Team & System Handoffs',
          handoffs: [
            { from: 'Product (PRD)', to: 'Engineering (Dev)', artifact: 'Approved spec + acceptance criteria', date: 'Week 1' },
            { from: 'Design (Wireframes)', to: 'Engineering (FE)', artifact: 'Figma files + design tokens', date: 'Week 2' },
            { from: 'Engineering (Code)', to: 'QA (Testing)', artifact: 'Deployed to staging, test plan', date: 'Week 5' },
            { from: 'QA (Sign-off)', to: 'Product (Launch)', artifact: 'Test results, performance metrics', date: 'Week 6' },
          ]
        },
        governanceAlignment: {
          title: 'PDLC Governance Alignment',
          requirements: [
            { requirement: 'PRD approved by stakeholders', status: 'Complete', evidence: 'Confluence sign-off' },
            { requirement: 'Architecture review completed', status: 'Pending', evidence: 'Architecture Board meeting scheduled Week 2' },
            { requirement: 'Security & Compliance review', status: 'Pending', evidence: 'PCI DSS audit required before launch' },
            { requirement: 'Performance benchmarks met', status: 'Not Started', evidence: 'Load testing planned Week 5' },
            { requirement: 'Launch readiness checklist', status: 'Not Started', evidence: 'To be completed Week 6' },
          ]
        }
      },
      build: {
        title: 'AI-Powered Build & Code Generation',
        type: 'aidlc',
        uiStructure: {
          title: 'Use Case → UI Structure',
          note: 'Generated from spec, no manual design needed',
          screens: [
            { name: 'Cart Summary', components: ['CartHeader', 'CartItemList', 'PromoInput', 'CheckoutButton'], useCase: 'UC-01: View Cart' },
            { name: 'Payment Selection', components: ['PaymentHeader', 'SavedCardCarousel', 'NewCardForm', 'SecurityBadge'], useCase: 'UC-03: Select Payment' },
            { name: 'Order Confirmation', components: ['SuccessIcon', 'OrderSummary', 'TrackingButton'], useCase: 'UC-05: Confirm Order' },
          ]
        },
        codeDerivations: {
          title: 'FE / BE / OL Code Derivations',
          note: 'Code skeletons generated from use cases, acceptance criteria, state diagrams, dependency graphs',
          frontend: {
            repo: 'checkout-ui-v2',
            files: [
              { path: 'src/components/Cart/CartSummary.tsx', lines: 145, source: 'UC-01, AC-1.1-1.3' },
              { path: 'src/components/Payment/PaymentSelection.tsx', lines: 234, source: 'UC-03, AC-3.1-3.5' },
              { path: 'src/components/Payment/SavedCardCarousel.tsx', lines: 89, source: 'UC-03, State: payment_method' },
              { path: 'src/hooks/usePromoValidation.ts', lines: 67, source: 'UC-02, Dependency: PromoEngine' },
            ],
            total: 1246
          },
          backend: {
            repo: 'payment-api-v3',
            files: [
              { path: 'src/services/PaymentService.ts', lines: 198, source: 'API Contract: /api/v3/payment/process' },
              { path: 'src/services/PromoService.ts', lines: 156, source: 'API Contract: /api/promo/validate' },
              { path: 'src/middleware/localization.ts', lines: 89, source: 'NFR: Multi-locale support' },
            ],
            total: 610
          },
          observability: {
            repo: 'checkout-observability',
            files: [
              { path: 'metrics/checkout-metrics.yaml', lines: 45, source: 'Success Metrics' },
              { path: 'alerts/payment-timeout-alert.yaml', lines: 23, source: 'NFR: Performance' },
            ],
            total: 68
          }
        },
        buildingBlocks: {
          title: 'Building Blocks Creation',
          note: 'Reusable components, patterns, and scaffolds',
          blocks: [
            { name: 'LoadingSpinner', type: 'Component', reusability: 'High', usage: '12 locations' },
            { name: 'ErrorBoundary', type: 'Pattern', reusability: 'High', usage: 'All routes' },
            { name: 'APIRetryHandler', type: 'Service', reusability: 'High', usage: 'All API calls' },
            { name: 'LocalizationProvider', type: 'Context', reusability: 'High', usage: 'App-wide' },
            { name: 'CheckoutLayout', type: 'Scaffold', reusability: 'Medium', usage: '5 pages' },
          ]
        },
        prGeneration: {
          title: 'Code Generation + PR',
          note: 'Wibey creates PR-ready code',
          prs: [
            { 
              id: '#1234', 
              title: 'feat: Mobile checkout UI v2 for IN market',
              status: 'Ready for Review',
              features: [
                'Correct folder structure: src/components/Checkout/',
                'API integration: PaymentService, PromoEngine',
                'Validated patterns: ErrorBoundary, LoadingStates',
                'Safety checks: Input validation, XSS protection',
                'Auto-readiness: 87% test coverage, lint passing',
              ],
              files: 6,
              additions: 1246,
              deletions: 45
            },
            { 
              id: '#1235', 
              title: 'feat: Promo fallback messaging',
              status: 'Ready for Review',
              features: [
                'Service integration: PromoEngine API',
                'Localization: Hindi/French/Spanish strings',
                'Error handling: Fallback UI on promo failure',
                'Feature flag: promo_fallback_messaging',
              ],
              files: 4,
              additions: 567,
              deletions: 23
            },
            { 
              id: '#1236', 
              title: 'feat: Multi-locale error messages',
              status: 'Ready for Review',
              features: [
                'Translation files: checkout_errors.{hi,fr,es}.json',
                'LocalizationProvider integration',
                'Fallback to English for missing translations',
              ],
              files: 3,
              additions: 234,
              deletions: 12
            },
          ]
        },
        automatedTests: {
          title: 'Automated Test Creation',
          note: 'Based on spec, Wibey generates test plans, unit tests, mocks, integration tests',
          testSuites: [
            {
              suite: 'Unit Tests',
              count: 32,
              coverage: '92%',
              tests: [
                'CartSummary component renders correctly',
                'PromoInput validates code format',
                'PaymentSelection handles saved cards',
                'ErrorBoundary catches and displays errors',
              ]
            },
            {
              suite: 'Integration Tests',
              count: 12,
              coverage: '85%',
              tests: [
                'Checkout flow: Cart → Payment → Confirmation',
                'Promo validation with PromoEngine API',
                'Payment processing with timeout handling',
                'Localization switches language correctly',
              ]
            },
            {
              suite: 'E2E Tests',
              count: 3,
              coverage: '100%',
              tests: [
                'Complete checkout journey (Happy Path)',
                'Checkout with promo code failure + fallback',
                'Payment timeout + retry flow',
              ]
            },
            {
              suite: 'Performance Tests',
              count: 5,
              tests: [
                'Payment page loads <1.5s on 3G',
                'Handles 10k concurrent checkouts',
                'Memory usage under 50MB',
              ]
            },
          ],
          summary: { total: 47, passed: 47, failed: 0, coverage: '89%' }
        },
        developerView: {
          title: 'Developer View (CLI / IDE)',
          note: 'Developers can interact with Wibey-generated code',
          capabilities: [
            { action: 'Pull scaffolds', command: 'wibey pull --spec MOBILE-1234', result: 'Downloaded code to ./checkout-ui-v2/' },
            { action: 'View traceability', command: 'wibey trace PaymentService.ts', result: 'Links to Spec FR-1, AC-1.1, API Contract' },
            { action: 'Run tests', command: 'wibey test --watch', result: '47 tests passing, 89% coverage' },
            { action: 'Approve changes', command: 'wibey approve #1234', result: 'PR #1234 approved, ready to merge' },
            { action: 'Reject changes', command: 'wibey reject #1235 --reason "Needs localization"', result: 'PR #1235 marked for revision' },
            { action: 'Incremental regen', command: 'wibey regen --component CartSummary', result: 'Re-generated CartSummary.tsx from updated spec' },
          ]
        }
      },
      trace: {
        title: 'Full Traceability & Audit Trail',
        type: 'receipts',
        note: 'Every action writes receipts for complete auditability',
        traceFlow: {
          title: 'End-to-End Traceability',
          flow: 'Intent → Spec → Code → Tests → Deploy → Learnings',
          fullTrace: 'Signal (47) → Theme (3) → Problem → JTBD (3) → Persona (3) → Requirement (12 FR + 8 NFR) → Spec v1.0 → Design (5 screens) → Code (1,924 lines) → Tests (47) → PRs (3) → Deploy (IN) → Metrics'
        },
        receipts: {
          title: 'Action Receipts',
          categories: [
            {
              category: 'Code Generated',
              receipts: [
                { timestamp: '2025-12-11 09:23:15', action: 'Generated checkout-ui-v2/src/components/Cart/CartSummary.tsx', source: 'Spec FR-1, AC-1.1-1.3', lines: 145, hash: 'a3f2c1b' },
                { timestamp: '2025-12-11 09:23:47', action: 'Generated payment-api-v3/src/services/PaymentService.ts', source: 'API Contract /api/v3/payment/process', lines: 198, hash: 'b7e9d4a' },
                { timestamp: '2025-12-11 09:24:12', action: 'Generated localization files (hi, fr, es)', source: 'NFR-5: Multi-locale', lines: 234, hash: 'c1a8f3e' },
              ],
              total: '1,924 lines across 15 files'
            },
            {
              category: 'Tests Generated',
              receipts: [
                { timestamp: '2025-12-11 09:27:03', action: 'Generated unit tests for CartSummary', source: 'AC-1.1-1.3', tests: 8, hash: 'd4b2e9c' },
                { timestamp: '2025-12-11 09:27:34', action: 'Generated integration tests for checkout flow', source: 'Use Case UC-01 to UC-05', tests: 12, hash: 'e5c3a1f' },
                { timestamp: '2025-12-11 09:28:01', action: 'Generated E2E tests', source: 'Primary Flow + Edge Cases', tests: 3, hash: 'f6d4b2a' },
              ],
              total: '47 tests (32 unit, 12 integration, 3 E2E)'
            },
            {
              category: 'Tests Passed / Failed',
              receipts: [
                { timestamp: '2025-12-11 09:30:15', result: 'PASS', suite: 'Unit Tests', passed: 32, failed: 0, duration: '4.2s', coverage: '92%' },
                { timestamp: '2025-12-11 09:32:47', result: 'PASS', suite: 'Integration Tests', passed: 12, failed: 0, duration: '18.7s', coverage: '85%' },
                { timestamp: '2025-12-11 09:35:23', result: 'PASS', suite: 'E2E Tests', passed: 3, failed: 0, duration: '45.3s', coverage: '100%' },
              ],
              summary: 'All 47 tests passed • 89% overall coverage • 68.2s total duration'
            },
            {
              category: 'PRs Merged',
              receipts: [
                { timestamp: '2025-12-11 14:30:42', pr: '#1234', title: 'Mobile checkout UI v2 for IN', reviewers: 'Sarah Chen, Mike Rodriguez', checks: 'All passed', merged_by: 'Sarah Chen' },
                { timestamp: '2025-12-11 14:45:18', pr: '#1235', title: 'Promo fallback messaging', reviewers: 'Lisa Wang', checks: 'All passed', merged_by: 'Lisa Wang' },
                { timestamp: '2025-12-11 15:12:33', pr: '#1236', title: 'Multi-locale errors', reviewers: 'Alex Kumar', checks: 'All passed', merged_by: 'Alex Kumar' },
              ],
              total: '3 PRs merged • 1,924 additions, 80 deletions'
            },
            {
              category: 'API & System Dependencies Traced',
              receipts: [
                { system: 'Payment Service v3', endpoint: '/api/v3/payment/process', calls: 1247, avg_latency: '1.2s', status: 'Healthy', linked_to: 'FR-1, NFR-1' },
                { system: 'Promo Engine', endpoint: '/api/promo/validate', calls: 456, avg_latency: '0.4s', status: 'Healthy', linked_to: 'FR-2' },
                { system: 'Localization Service', endpoint: '/api/i18n/translate', calls: 2341, avg_latency: '0.15s', status: 'Healthy', linked_to: 'FR-3, NFR-5' },
              ],
              total: '3 external dependencies tracked • All meeting SLA targets'
            },
            {
              category: 'Exceptions Flagged',
              receipts: [
                { timestamp: '2025-12-11 16:23:15', exception: 'PaymentTimeoutException', count: 3, severity: 'Warning', resolution: 'Retry succeeded', linked_to: 'NFR-1: Performance' },
                { timestamp: '2025-12-11 17:08:42', exception: 'LocalizationKeyMissing', count: 1, severity: 'Info', resolution: 'Fallback to English', linked_to: 'NFR-5: Localization' },
              ],
              summary: '4 exceptions • 0 critical • All handled gracefully'
            },
            {
              category: 'Build + Deploy Logs',
              receipts: [
                { timestamp: '2025-12-11 17:15:00', stage: 'Build', status: 'Success', duration: '3m 45s', artifacts: 'checkout-ui-v2@1.0.0, payment-api-v3@1.2.1' },
                { timestamp: '2025-12-11 17:30:00', stage: 'Deploy to Staging', status: 'Success', environment: 'staging-in', health_check: 'Passed' },
                { timestamp: '2025-12-11 17:45:00', stage: 'Smoke Tests', status: 'Success', tests_run: 15, all_passed: true },
                { timestamp: '2025-12-11 18:00:00', stage: 'Deploy to Production', status: 'Success', environment: 'prod-in', rollout: 'Gradual (10% → 50% → 100%)', health_check: 'Passed' },
              ],
              summary: 'Deployed to prod-in in 45 minutes • Zero downtime • All health checks passed'
            },
          ]
        },
        compliance: {
          title: 'Compliance & Certification',
          checks: [
            { standard: 'PCI DSS Level 1', status: 'Compliant', verified: '2025-12-11', auditor: 'Security Team' },
            { standard: 'WCAG 2.1 AA', status: 'Compliant', verified: '2025-12-11', auditor: 'Accessibility Team' },
            { standard: 'SOC 2 Type II', status: 'Compliant', verified: '2025-12-11', auditor: 'Compliance Team' },
            { standard: 'GDPR', status: 'Compliant', verified: '2025-12-11', auditor: 'Legal Team' },
          ]
        }
      },
      learn: {
        title: 'Continuous Learning & Feedback',
        type: 'operational',
        note: 'Operational data feeds directly back into Wibey',
        timeframe: '30 days post-launch (IN market)',
        performanceMetrics: {
          title: 'Performance Metrics',
          metrics: [
            { name: 'Cart abandonment rate', before: '68%', after: '43%', target: '40%', status: 'improving', trend: 'down', change: '-37%' },
            { name: 'Mobile conversion rate', before: '12%', after: '15.4%', target: '15%', status: 'exceeded', trend: 'up', change: '+28%' },
            { name: 'Payment page load time (P95)', before: '2.8s', after: '1.8s', target: '1.5s', status: 'improving', trend: 'down', change: '-36%' },
            { name: 'Promo validation success', before: '55%', after: '82%', target: '90%', status: 'improving', trend: 'up', change: '+49%' },
            { name: 'Support tickets (weekly)', before: '2,340', after: '1,420', target: '1,400', status: 'nearly met', trend: 'down', change: '-39%' },
            { name: 'IN market revenue (monthly)', before: '$2.4M', after: '$3.2M', target: '$3.5M', status: 'improving', trend: 'up', change: '+33%' },
          ],
          chartData: 'Line chart showing 30-day trend for each metric'
        },
        operationalIssues: {
          title: 'Operational Data Feeding Back',
          categories: [
            {
              category: 'Latency Issues',
              count: 12,
              issues: [
                { issue: 'Payment Service v3 still at 1.8s P95 (target: <1.5s)', frequency: '15% of requests', impact: 'Medium', root_cause: 'Database query optimization needed' },
                { issue: 'Low-end Android devices: 3.2s page load', frequency: '8% of users', impact: 'High', root_cause: 'Asset bundle size too large for 2GB RAM devices' },
              ]
            },
            {
              category: 'Error Patterns',
              count: 8,
              issues: [
                { issue: 'Card declined error message confusing users', frequency: '234 incidents', impact: 'Medium', pattern: 'Users retry same card multiple times' },
                { issue: 'Session timeout during payment entry', frequency: '89 incidents', impact: 'Medium', pattern: 'Happens after 3+ minutes on payment page' },
              ]
            },
            {
              category: 'User Friction Points',
              count: 5,
              issues: [
                { issue: 'Users don\'t understand promo fallback message', frequency: '156 support tickets', impact: 'Low', feedback: '"What does \'continue without promo\' mean?"' },
                { issue: 'Hindi translations feel unnatural', frequency: '67 complaints', impact: 'Medium', feedback: '"English words mixed in Hindi text"' },
              ]
            },
            {
              category: 'Flaky Tests',
              count: 3,
              issues: [
                { test: 'E2E: Complete checkout with saved card', frequency: '12% failure rate', impact: 'Low', cause: 'Race condition in payment confirmation' },
                { test: 'Integration: Promo validation timeout', frequency: '5% failure rate', impact: 'Low', cause: 'Mock promo service not reliable' },
              ]
            },
            {
              category: 'Regression Hotspots',
              count: 2,
              issues: [
                { area: 'Cart item quantity update', regressions: 3, last_incident: '2025-12-15', pattern: 'Breaks when promo code is applied' },
                { area: 'Saved card deletion', regressions: 2, last_incident: '2025-12-18', pattern: 'UI state not updating after deletion' },
              ]
            },
            {
              category: 'Feature Usage Drops',
              count: 1,
              issues: [
                { feature: 'Saved card carousel', usage_before: '45%', usage_after: '38%', drop: '-15%', hypothesis: 'Too many swipe gestures required' },
              ]
            },
          ]
        },
        newSignals: {
          title: 'New Insights or Signals',
          signals: [
            { signal: 'Users requesting PayPal option', source: 'VOC + Support tickets', count: 234, sentiment: 'High demand', priority: 'P1' },
            { signal: 'CA market showing similar abandonment pattern', source: 'Analytics', impact: 'Potential 15% revenue increase', priority: 'P0' },
            { signal: 'Guest checkout converting better than logged-in', source: 'A/B test data', insight: 'Login friction point identified', priority: 'P1' },
          ]
        },
        visualizations: {
          title: 'Charts & Graphs',
          charts: [
            { 
              type: 'Line Chart', 
              title: 'Cart Abandonment Rate (30 days)',
              data: '68% → 65% → 58% → 52% → 48% → 43%',
              trend: 'Decreasing',
              note: 'Weekly measurements showing consistent improvement'
            },
            { 
              type: 'Bar Chart', 
              title: 'Support Ticket Volume by Category',
              categories: ['Payment timeout (560)', 'Promo issues (420)', 'Localization (240)', 'Other (200)'],
              note: 'Payment timeout still #1 but reduced 40%'
            },
            { 
              type: 'Funnel Chart', 
              title: 'Checkout Conversion Funnel',
              stages: 'Cart (100%) → Checkout (78%) → Payment (65%) → Confirmation (57%)',
              drop_off: 'Largest drop at Payment → Confirmation (8%)',
              note: 'Payment step improved from 43% to 57% completion'
            },
            { 
              type: 'Heat Map', 
              title: 'Error Rate by Hour & Day',
              peak_times: 'Weekday evenings 7-9pm IST',
              note: 'Correlates with campaign periods and traffic spikes'
            },
            { 
              type: 'Pie Chart', 
              title: 'Device Distribution',
              breakdown: 'Android (62%), iOS (28%), Desktop (10%)',
              note: 'Low-end Android (2GB RAM) = 8% of total, 25% of errors'
            },
          ]
        },
        nextIterations: {
          title: 'Suggested Next Iterations',
          initiatives: [
            { 
              title: 'Low-End Device Performance Optimization',
              priority: 'P0',
              effort: 'L',
              rationale: '8% of users, 25% of errors, direct revenue impact',
              estimated_impact: '+5% conversion, $400K/month revenue',
              confidence: 'High'
            },
            { 
              title: 'Checkout Error UX Refinement',
              priority: 'P1',
              effort: 'M',
              rationale: 'Card declined messaging causing user confusion and retries',
              estimated_impact: '-20% support tickets, better UX',
              confidence: 'Medium'
            },
            { 
              title: 'PayPal Integration',
              priority: 'P1',
              effort: 'M',
              rationale: '234 user requests, common in IN market',
              estimated_impact: '+3% conversion from payment method preference',
              confidence: 'Medium'
            },
            { 
              title: 'CA Market Rollout',
              priority: 'P0',
              effort: 'S',
              rationale: 'Similar abandonment pattern observed, proven solution',
              estimated_impact: '+$600K/month revenue in CA',
              confidence: 'High'
            },
          ]
        }
      }
    }

    const data = canvasContent[currentStep]
    if (!data) return null

    return (
      <div>
        {/* Canvas Header with Breadcrumb Flow - Only show after sources are shared */}
        {sourcesShared && (
          <div className="bg-white border-b border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex
                const isCompleted = idx < currentStepIndex
                const isAccessible = idx <= currentStepIndex
                const IconComponent = step.icon
                
                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <button
                      onClick={() => {
                        if (isAccessible) {
                          setCurrentStep(step.id as WorkflowStep)
                          scrollCanvasToTop()
                        }
                      }}
                      disabled={!isAccessible}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        isActive ? 'bg-blue-600 text-white font-semibold shadow-md' :
                        isCompleted ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                        isAccessible ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' :
                        'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm">{step.label}</span>
                      {isCompleted && <span className="text-xs">✓</span>}
                    </button>
                    {idx < steps.length - 1 && (
                      <svg className="w-4 h-4 mx-1 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Canvas Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {sourcesShared && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{data.title}</h3>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
            )}

            {/* Welcome Screen for Capture */}
            {currentStep === 'capture' && !sourcesShared && (
              <div className="max-w-4xl mx-auto py-12">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center mb-6">
                    <img src={WibeyLogo} alt="Wibey" className="w-24 h-24" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to Wibey
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Your AI-powered partner for the complete Product Development Lifecycle
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="p-6 bg-white border-2 border-blue-100 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Capture & Synthesize</h3>
                    <p className="text-sm text-gray-600">
                      Connect to Confluence, Jira, Slack, and more. I'll automatically extract insights, identify patterns, and synthesize themes from scattered information.
                    </p>
                  </div>

                  <div className="p-6 bg-white border-2 border-purple-100 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Generate Specifications</h3>
                    <p className="text-sm text-gray-600">
                      Transform insights into structured PRDs with functional requirements, NFRs, API contracts, and feature flags – all machine-readable and SpecKit compatible.
                    </p>
                  </div>

                  <div className="p-6 bg-white border-2 border-green-100 rounded-xl hover:border-green-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Palette className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Design Automation</h3>
                    <p className="text-sm text-gray-600">
                      Generate UI wireframes, component specs, and system architecture diagrams directly from your specifications using MagicScreen and GenMap.
                    </p>
                  </div>

                  <div className="p-6 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <Workflow className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Smart Planning & Build</h3>
                    <p className="text-sm text-gray-600">
                      Auto-generate epics, estimate effort, map dependencies, create code scaffolds, and produce tests – all linked back to your original requirements.
                    </p>
                  </div>

                  <div className="p-6 bg-white border-2 border-pink-100 rounded-xl hover:border-pink-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Full Traceability</h3>
                    <p className="text-sm text-gray-600">
                      Track every decision from initial signal to production deployment. View complete audit trails with compliance checks and certification checklists.
                    </p>
                  </div>

                  <div className="p-6 bg-white border-2 border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                      <Lightbulb className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Continuous Learning</h3>
                    <p className="text-sm text-gray-600">
                      Analyze post-launch metrics, user feedback, and operational data. Automatically identify improvement opportunities and suggest next iterations.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                  <h3 className="font-bold text-xl mb-3">Ready to get started?</h3>
                  <p className="text-gray-600 mb-6">
                    Share your Confluence docs, Jira tickets, or Slack channels and I'll begin capturing signals.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <LinkIcon className="w-4 h-4" />
                    <span>Click "Share links & documents" in the chat to begin</span>
                  </div>
                </div>
              </div>
            )}

            {/* Captured Sources */}
            {data.items && currentStep === 'capture' && sourcesShared && (
              <div className="space-y-4">
                {data.items.map((item: any, idx: number) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors overflow-hidden">
                    {/* Source Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{item.type === 'Confluence' ? '📄' : item.type === 'Jira' ? '🎫' : '💬'}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-bold text-lg">{item.name}</h5>
                              {item.status && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {item.status}
                                </span>
                              )}
                              {item.priority && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-bold">
                                  {item.priority}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.type} • {item.owner} • {item.modified}
                            </div>
                            {item.url && (
                              <a href={item.url} className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                                🔗 {item.url}
                              </a>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                          {item.insights} insights
                        </span>
                      </div>
                      {item.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags.map((tag: string, tagIdx: number) => (
                            <span key={tagIdx} className="px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Source Content */}
                    <div className="p-4 bg-white">
                      {/* Preview */}
                      {item.preview && (
                        <div className="mb-4 p-3 bg-gray-50 border-l-4 border-blue-500 rounded">
                          <div className="text-sm text-gray-700 italic">{item.preview}</div>
                        </div>
                      )}

                      {/* Confluence Sections */}
                      {item.sections && (
                        <div className="space-y-3 mb-4">
                          <div className="text-xs font-semibold text-gray-600 uppercase">Key Sections Extracted:</div>
                          {item.sections.map((section: any, sIdx: number) => (
                            <div key={sIdx} className="pl-4 border-l-2 border-gray-300">
                              <div className="font-semibold text-sm text-gray-800 mb-1">{section.title}</div>
                              <div className="text-sm text-gray-600">{section.excerpt}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Jira Comments */}
                      {item.comments && (
                        <div className="space-y-2 mb-4">
                          <div className="text-xs font-semibold text-gray-600 uppercase">Key Comments:</div>
                          {item.comments.map((comment: any, cIdx: number) => (
                            <div key={cIdx} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                  {comment.author[0]}
                                </div>
                                <span className="text-sm font-semibold">{comment.author}</span>
                                <span className="text-xs text-gray-500">• {comment.timestamp}</span>
                              </div>
                              <div className="text-sm text-gray-700">{comment.text}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Jira Linked Issues */}
                      {item.linkedIssues && (
                        <div className="mb-4">
                          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">Linked Issues:</div>
                          <div className="flex flex-wrap gap-2">
                            {item.linkedIssues.map((issue: string, iIdx: number) => (
                              <a key={iIdx} href="#" className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">
                                {issue}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Slack Messages */}
                      {item.keyMessages && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
                            Key Messages ({item.messageCount} total):
                          </div>
                          {item.keyMessages.map((msg: any, mIdx: number) => (
                            <div key={mIdx} className="p-3 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors">
                              <div className="flex items-start gap-2 mb-2">
                                <div className="w-8 h-8 bg-purple-600 text-white rounded flex items-center justify-center text-xs font-semibold">
                                  {msg.author[0]}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold">{msg.author}</span>
                                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                  </div>
                                  <div className="text-sm text-gray-700">{msg.text}</div>
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-gray-500">👍 {msg.reactions} reactions</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Channel Info */}
                      {item.channel && (
                        <div className="mt-3 text-xs text-gray-500">
                          From {item.channel} • {item.messageCount} messages analyzed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Key Highlights from Sources */}
            {data.type === 'highlights' && data.sources && (
              <div className="space-y-6">
                {data.sources.map((source: any, sourceIdx: number) => (
                  <div key={sourceIdx} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-200">
                      <h5 className="font-bold text-gray-800">{source.name}</h5>
                    </div>
                    <div className="p-4 bg-white space-y-2">
                      {source.highlights.map((highlight: any, highlightIdx: number) => (
                        <div key={highlightIdx} className={`p-3 rounded-lg border-l-4 ${
                          highlight.severity === 'critical' ? 'bg-red-50 border-red-500' :
                          highlight.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                          'bg-yellow-50 border-yellow-500'
                        }`}>
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">{highlight.text}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              highlight.severity === 'critical' ? 'bg-red-100 text-red-700' :
                              highlight.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {highlight.severity.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 capitalize">{highlight.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Summary Section with Chart */}
                {data.summary && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                    <h5 className="font-bold text-lg mb-4">🎯 Identified Themes</h5>
                    
                    {/* Bar Chart Visualization */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                      <div className="text-xs font-semibold text-gray-600 mb-3">SIGNAL DISTRIBUTION BY THEME</div>
                      {data.summary.themes.map((theme: any, themeIdx: number) => {
                        const maxSignals = Math.max(...data.summary.themes.map((t: any) => t.signals))
                        const widthPercent = (theme.signals / maxSignals) * 100
                        return (
                          <div key={themeIdx} className="mb-3">
                            <div className="flex items-center justify-between mb-1 text-sm">
                              <span className="font-medium">{theme.theme}</span>
                              <span className="font-bold">{theme.signals} signals</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white ${
                                  theme.priority === 'P0' ? 'bg-red-500' :
                                  theme.priority === 'P1' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${widthPercent}%` }}
                              >
                                {theme.priority}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="space-y-3">
                      {data.summary.themes.map((theme: any, themeIdx: number) => (
                        <div key={themeIdx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                          <div>
                            <span className="font-semibold text-gray-800">{theme.theme}</span>
                            <span className="text-sm text-gray-600 ml-3">{theme.signals} signals</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            theme.priority === 'P0' ? 'bg-red-100 text-red-700' :
                            theme.priority === 'P1' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {theme.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Structured Synthesis */}
            {data.type === 'structured' && (
              <div className="space-y-6">
                {/* Problem Statement */}
                {data.problemStatement && (
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-2">{data.problemStatement.title}</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">{data.problemStatement.content}</p>
                  </div>
                )}

                {/* Jobs to be Done */}
                {data.jobsToBeDone && (
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.jobsToBeDone.title}</h5>
                    <ul className="space-y-2">
                      {data.jobsToBeDone.jobs.map((job: string, jobIdx: number) => (
                        <li key={jobIdx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-bold">→</span>
                          <span className="italic">"{job}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hypothesis */}
                {data.hypothesis && (
                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.hypothesis.title}</h5>
                    <ul className="space-y-2">
                      {data.hypothesis.statements.map((statement: string, statementIdx: number) => (
                        <li key={statementIdx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-purple-600 font-bold">💡</span>
                          <span>{statement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* User Journeys */}
                {data.userJourneys && (
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.userJourneys.title}</h5>
                    <div className="space-y-2">
                      {data.userJourneys.journeys.map((journey: any, journeyIdx: number) => (
                        <div key={journeyIdx} className="bg-white p-3 rounded border border-green-200">
                          <div className="font-semibold text-sm text-gray-800 mb-1">{journey.step}</div>
                          <div className="text-xs text-gray-600">
                            <span className="text-red-600">Pain: {journey.pain}</span>
                            <span className="mx-2">•</span>
                            <span className="text-green-600">Opportunity: {journey.opportunity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acceptance Criteria */}
                {data.acceptanceCriteria && (
                  <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.acceptanceCriteria.title}</h5>
                    <ul className="space-y-2">
                      {data.acceptanceCriteria.criteria.map((criterion: string, criterionIdx: number) => (
                        <li key={criterionIdx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-indigo-600 font-bold">✓</span>
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dependencies */}
                {data.dependencies && (
                  <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.dependencies.title}</h5>
                    <div className="space-y-2">
                      {data.dependencies.items.map((dep: any, depIdx: number) => (
                        <div key={depIdx} className="bg-white p-3 rounded border border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              dep.type === 'Team' ? 'bg-blue-100 text-blue-700' :
                              dep.type === 'System' ? 'bg-purple-100 text-purple-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {dep.type}
                            </span>
                            <span className="font-semibold text-sm">{dep.name}</span>
                          </div>
                          <div className="text-xs text-gray-600">{dep.dependency}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uncertainty Areas */}
                {data.uncertaintyAreas && (
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.uncertaintyAreas.title}</h5>
                    <div className="space-y-2">
                      {data.uncertaintyAreas.areas.map((area: any, areaIdx: number) => (
                        <div key={areaIdx} className="bg-white p-3 rounded border border-yellow-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-gray-800">{area.area}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              area.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {area.impact} Impact
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 italic">❓ {area.question}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PRD Document */}
            {data.type === 'prd' && (
              <div className="bg-white">
                {/* Document Header */}
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">Version {data.version}</div>
                    <div className="text-xs text-gray-500">Last modified: {data.lastModified}</div>
                  </div>
                  <div className="text-xs text-gray-600">Author: {data.author}</div>
                </div>

                {/* Table of Contents */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="font-semibold text-sm mb-2">📑 Table of Contents</div>
                  <ol className="text-sm space-y-1 ml-4">
                    {data.sections.map((section: any, idx: number) => (
                      <li key={idx} className="text-blue-600 hover:underline cursor-pointer">{section.title}</li>
                    ))}
                  </ol>
                </div>

                {/* Document Sections */}
                <div className="space-y-8">
                  {data.sections.map((section: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-bold mb-3">{section.title}</h4>
                      
                      {section.content && (
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line mb-3">{section.content}</p>
                      )}

                      {section.links && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {section.links.map((link: string, linkIdx: number) => (
                            <a key={linkIdx} href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                              🔗 {link}
                            </a>
                          ))}
                        </div>
                      )}

                      {section.metrics && (
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden mb-3">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-semibold">Metric</th>
                              <th className="px-4 py-2 text-left font-semibold">Current</th>
                              <th className="px-4 py-2 text-left font-semibold">Target</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.metrics.map((metric: any, mIdx: number) => (
                              <tr key={mIdx} className="border-t border-gray-200">
                                <td className="px-4 py-2">{metric.metric}</td>
                                <td className="px-4 py-2 text-red-600 font-medium">{metric.current}</td>
                                <td className="px-4 py-2 text-green-600 font-medium">{metric.target}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {section.personas && (
                        <div>
                          <div className="font-semibold text-sm mb-3">Personas</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            {section.personas.map((persona: any, pIdx: number) => (
                              <div key={pIdx} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="font-semibold text-sm mb-1">{persona.name}</div>
                                <div className="text-xs text-gray-600 mb-2">{persona.description}</div>
                                {persona.segment && (
                                  <div className="text-xs text-purple-700 italic">{persona.segment}</div>
                                )}
                              </div>
                            ))}
                          </div>

                          {section.primaryFlows && (
                            <div className="mb-4">
                              <div className="font-semibold text-sm mb-2">Primary Flows</div>
                              <ul className="space-y-1">
                                {section.primaryFlows.map((flow: string, fIdx: number) => (
                                  <li key={fIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-blue-600">→</span>
                                    <span>{flow}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {section.alternativeFlows && (
                            <div className="mb-4">
                              <div className="font-semibold text-sm mb-2">Alternative Flows</div>
                              <ul className="space-y-1">
                                {section.alternativeFlows.map((flow: string, fIdx: number) => (
                                  <li key={fIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-green-600">↷</span>
                                    <span>{flow}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {section.edgeCases && (
                            <div className="mb-4">
                              <div className="font-semibold text-sm mb-2">Edge Cases</div>
                              <div className="space-y-2">
                                {section.edgeCases.map((edge: any, eIdx: number) => (
                                  <div key={eIdx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="font-semibold text-sm mb-1">{edge.case}</div>
                                    <div className="text-xs text-gray-700">Handling: {edge.handling}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {section.featureBoundaries && (
                            <div className="mb-4">
                              <div className="font-semibold text-sm mb-2">Feature Boundaries</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="font-semibold text-xs text-green-700 mb-2">✓ In Scope</div>
                                  <ul className="space-y-1">
                                    {section.featureBoundaries.inScope.map((item: string, iIdx: number) => (
                                      <li key={iIdx} className="text-xs text-gray-700">• {item}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <div className="font-semibold text-xs text-red-700 mb-2">✗ Out of Scope</div>
                                  <ul className="space-y-1">
                                    {section.featureBoundaries.outOfScope.map((item: string, oIdx: number) => (
                                      <li key={oIdx} className="text-xs text-gray-700">• {item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {section.risks && (
                            <div className="mb-4">
                              <div className="font-semibold text-sm mb-2">Risks & Mitigation</div>
                              <div className="space-y-2">
                                {section.risks.map((risk: any, rIdx: number) => (
                                  <div key={rIdx} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-1">
                                      <div className="font-semibold text-sm">{risk.risk}</div>
                                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        risk.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                      }`}>
                                        {risk.impact}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-700">Mitigation: {risk.mitigation}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {section.businessOutcomes && (
                            <div>
                              <div className="font-semibold text-sm mb-2">Expected Business Outcomes</div>
                              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-semibold">Outcome</th>
                                    <th className="px-3 py-2 text-left font-semibold">Current</th>
                                    <th className="px-3 py-2 text-left font-semibold">Target</th>
                                    <th className="px-3 py-2 text-left font-semibold">Timeline</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {section.businessOutcomes.map((outcome: any, oIdx: number) => (
                                    <tr key={oIdx} className="border-t border-gray-200">
                                      <td className="px-3 py-2">{outcome.outcome}</td>
                                      <td className="px-3 py-2 text-red-600">{outcome.current}</td>
                                      <td className="px-3 py-2 text-green-600 font-semibold">{outcome.target}</td>
                                      <td className="px-3 py-2 text-gray-600 text-xs">{outcome.timeline}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {section.requirements && (
                        <div className="space-y-2 mb-3">
                          {section.requirements.map((req: any, rIdx: number) => (
                            <div key={rIdx} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                              <div className="flex items-start justify-between mb-1">
                                <div className="font-semibold text-sm">{req.id}: {req.title}</div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  req.priority === 'P0' ? 'bg-red-100 text-red-700' : 
                                  req.priority === 'P1' ? 'bg-yellow-100 text-yellow-700' : 
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {req.priority}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">{req.description}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.nfrs && (
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden mb-3">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-semibold w-1/4">Category</th>
                              <th className="px-4 py-2 text-left font-semibold">Requirement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.nfrs.map((nfr: any, nIdx: number) => (
                              <tr key={nIdx} className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{nfr.category}</td>
                                <td className="px-4 py-2 text-gray-700">{nfr.requirement}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {section.apis && (
                        <div className="space-y-2 mb-3">
                          {section.apis.map((api: any, aIdx: number) => (
                            <div key={aIdx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-semibold text-sm">{api.service}</div>
                                <div className="text-xs text-gray-600">Owner: {api.owner}</div>
                              </div>
                              <div className="text-xs font-mono text-gray-700 mb-1">{api.endpoint}</div>
                              <div className="text-xs text-gray-600">Timeout: {api.timeout}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.flags && (
                        <div className="space-y-2 mb-3">
                          {section.flags.map((flag: any, fIdx: number) => (
                            <div key={fIdx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <code className="text-sm font-mono font-semibold">{flag.flag}</code>
                                <span className="px-2 py-1 bg-gray-700 text-white rounded text-xs font-medium">{flag.default}</span>
                              </div>
                              <div className="text-xs text-gray-600">{flag.rollout}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.items && (
                        <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                          {section.items.map((item: string, iIdx: number) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Document Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-xs text-gray-500">Generated by Wibey AI • {new Date().toLocaleDateString()}</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50">📥 Export PDF</button>
                    <button className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50">📋 Copy Link</button>
                    <button className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50">💬 Comment</button>
                  </div>
                </div>
              </div>
            )}

            {/* Design Wireframes */}
            {data.type === 'wireframes' && data.screens && (
              <div className="space-y-8">
                {data.screens.map((screen: any, idx: number) => (
                  <div key={idx} className="border border-gray-300 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
                    {/* Screen Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="font-bold text-lg">{screen.name}</h5>
                        <div className="text-xs text-gray-600 mt-1">
                          {screen.components.length} components
                          {screen.interactions && ` • ${screen.interactions.length} interactions`}
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50">
                        View Details
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Wireframe Preview */}
                      <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="bg-white rounded-lg shadow-sm max-w-[320px] mx-auto">
                          {/* Mobile Device Frame */}
                          <div className="border-4 border-gray-800 rounded-[2rem] p-3 shadow-xl">
                            {/* Screen Content */}
                            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                              {screen.wireframe.sections.map((section: any, sIdx: number) => (
                                <div key={sIdx} className={`${sIdx > 0 ? 'border-t border-gray-200' : ''}`}>
                                  {section.type === 'header' && (
                                    <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-sm">
                                      {section.label}
                                    </div>
                                  )}
                                  {section.type === 'list' && (
                                    <div className="p-4">
                                      <div className="text-xs text-gray-600 mb-2">{section.label}</div>
                                      <div className="space-y-2">
                                        <div className="h-12 bg-gray-100 rounded"></div>
                                        <div className="h-12 bg-gray-100 rounded"></div>
                                        <div className="h-12 bg-gray-100 rounded"></div>
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'input' && (
                                    <div className="p-4">
                                      <div className="text-xs text-gray-600 mb-1">{section.label}</div>
                                      <div className="h-10 border-2 border-gray-300 rounded px-2 flex items-center bg-white">
                                        <span className="text-xs text-gray-400">Enter code...</span>
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'summary' && (
                                    <div className="px-4 py-3 bg-gray-50">
                                      <div className="text-sm font-semibold text-right">{section.label}</div>
                                    </div>
                                  )}
                                  {section.type === 'button' && (
                                    <div className="p-4">
                                      <button className={`w-full py-3 rounded-lg text-sm font-semibold ${
                                        section.primary ? 'bg-blue-600 text-white' : 
                                        section.secondary ? 'bg-gray-200 text-gray-700' : 
                                        'border border-gray-300 text-gray-700'
                                      }`}>
                                        {section.label}
                                      </button>
                                    </div>
                                  )}
                                  {section.type === 'form' && (
                                    <div className="p-4">
                                      <div className="text-xs text-gray-600 mb-2">{section.label}</div>
                                      <div className="space-y-2">
                                        {section.fields.map((field: string, fIdx: number) => (
                                          <div key={fIdx}>
                                            <div className="text-xs text-gray-600 mb-1">{field}</div>
                                            <div className="h-8 border-2 border-gray-300 rounded bg-white"></div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'radio-group' && (
                                    <div className="p-4">
                                      <div className="text-xs text-gray-600 mb-2">{section.label}</div>
                                      <div className="space-y-2">
                                        {section.options.map((option: string, oIdx: number) => (
                                          <div key={oIdx} className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-blue-600 rounded-full"></div>
                                            <span className="text-xs">{option}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'carousel' && (
                                    <div className="p-4">
                                      <div className="text-xs text-gray-600 mb-2">{section.label}</div>
                                      <div className="flex gap-2 overflow-x-auto">
                                        {Array(section.count).fill(0).map((_, cIdx) => (
                                          <div key={cIdx} className="w-32 h-20 bg-gray-100 rounded flex-shrink-0 border-2 border-gray-300"></div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'divider' && (
                                    <div className="flex items-center gap-2 px-4 py-2">
                                      <div className="flex-1 border-t border-gray-300"></div>
                                      <span className="text-xs text-gray-500">{section.label}</span>
                                      <div className="flex-1 border-t border-gray-300"></div>
                                    </div>
                                  )}
                                  {section.type === 'card-input' && (
                                    <div className="p-4">
                                      <div className="text-xs text-gray-600 mb-2">{section.label}</div>
                                      <div className="space-y-2">
                                        <div className="h-10 border-2 border-gray-300 rounded bg-white"></div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="h-10 border-2 border-gray-300 rounded bg-white"></div>
                                          <div className="h-10 border-2 border-gray-300 rounded bg-white"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'checkbox' && (
                                    <div className="px-4 py-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                                        <span className="text-xs">{section.label}</span>
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'security' && (
                                    <div className="px-4 py-2">
                                      <div className="flex items-center justify-center gap-2 text-green-600">
                                        <span className="text-sm">{section.label}</span>
                                      </div>
                                    </div>
                                  )}
                                  {section.type === 'spinner' && (
                                    <div className="p-8 flex flex-col items-center justify-center">
                                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                      <div className="text-sm font-medium text-gray-700">{section.label}</div>
                                    </div>
                                  )}
                                  {section.type === 'text' && (
                                    <div className="px-4 py-2 text-center">
                                      <div className="text-xs text-gray-600">{section.label}</div>
                                    </div>
                                  )}
                                  {section.type === 'icon' && (
                                    <div className="p-8 flex justify-center">
                                      <div className={`text-6xl ${section.color === 'green' ? 'text-green-500' : 'text-blue-500'}`}>
                                        {section.label}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {/* Home Indicator */}
                            <div className="flex justify-center mt-2">
                              <div className="w-20 h-1 bg-gray-800 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Details Panel */}
                      <div className="space-y-4">
                        {/* Components */}
                        <div>
                          <h6 className="font-semibold text-sm mb-2">Components</h6>
                          <div className="flex flex-wrap gap-2">
                            {screen.components.map((component: string, cIdx: number) => (
                              <span key={cIdx} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {component}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* States */}
                        {screen.states && (
                          <div>
                            <h6 className="font-semibold text-sm mb-2">States</h6>
                            <div className="flex flex-wrap gap-2">
                              {screen.states.map((state: string, sIdx: number) => (
                                <span key={sIdx} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {state}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactions */}
                        {screen.interactions && (
                          <div>
                            <h6 className="font-semibold text-sm mb-2">Interactions</h6>
                            <ul className="space-y-1">
                              {screen.interactions.map((interaction: string, iIdx: number) => (
                                <li key={iIdx} className="text-xs text-gray-700 flex items-start gap-2">
                                  <span className="text-blue-600">→</span>
                                  <span>{interaction}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Design Tokens */}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <h6 className="font-semibold text-xs mb-2">Design Tokens</h6>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Primary Color:</span>
                              <span className="font-mono">#2563EB</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Font:</span>
                              <span className="font-mono">Inter, 14px</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Border Radius:</span>
                              <span className="font-mono">8px</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Planning Workflow Guidance */}
            {data.type === 'workflow' && (
              <div className="space-y-6">
                {/* Dependency Resolution */}
                {data.dependencyResolution && (
                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.dependencyResolution.title}</h5>
                    <div className="space-y-2">
                      {data.dependencyResolution.dependencies.map((dep: any, depIdx: number) => (
                        <div key={depIdx} className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-start justify-between mb-1">
                            <div className="text-sm font-semibold">{dep.from} → {dep.to}</div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              dep.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                              dep.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {dep.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">{dep.type}: {dep.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sequencing with Timeline */}
                {data.sequencing && (
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.sequencing.title}</h5>
                    
                    {/* Timeline Visualization */}
                    <div className="bg-white p-4 rounded border border-blue-200 mb-4">
                      <div className="text-xs font-semibold text-gray-600 mb-3">TIMELINE VIEW</div>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                        {data.sequencing.sequence.map((seq: any, seqIdx: number) => (
                          <div key={seqIdx} className="relative pl-12 pb-8 last:pb-0">
                            <div className="absolute left-0 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                              {seq.order}
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <div className="font-semibold text-sm mb-1">{seq.work}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">{seq.duration}</span>
                                {seqIdx < data.sequencing.sequence.length - 1 && (
                                  <span className="text-gray-400">→ Week {seqIdx * 2 + 1}-{seqIdx * 2 + 2}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {data.sequencing.sequence.map((seq: any, seqIdx: number) => (
                        <div key={seqIdx} className="bg-white p-3 rounded border border-blue-200 flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {seq.order}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm mb-1">{seq.work}</div>
                            <div className="text-xs text-gray-600 mb-1">{seq.rationale}</div>
                            <div className="text-xs text-blue-600 font-medium">Duration: {seq.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizing */}
                {data.sizing && (
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.sizing.title}</h5>
                    <div className="space-y-2 mb-3">
                      {data.sizing.epics.map((epic: any, epicIdx: number) => (
                        <div key={epicIdx} className="bg-white p-3 rounded border border-green-200">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <span className="font-semibold text-sm">{epic.id}: {epic.name}</span>
                              <div className="text-xs text-gray-600 mt-1">{epic.team}</div>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                epic.effort === 'S' ? 'bg-green-100 text-green-700' :
                                epic.effort === 'M' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {epic.effort}
                              </span>
                              <span className="px-2 py-1 rounded text-xs bg-gray-100">{epic.points} pts</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600">
                            Confidence: {epic.confidence} • {epic.assumptions}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-3 rounded border border-green-300 text-sm">
                      <strong>Total:</strong> {data.sizing.totalPoints} points • 
                      <strong className="ml-2">Velocity:</strong> {data.sizing.velocity} • 
                      <strong className="ml-2">Duration:</strong> {data.sizing.estimatedDuration}
                    </div>
                  </div>
                )}

                {/* Risk Evaluation */}
                {data.riskEvaluation && (
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.riskEvaluation.title}</h5>
                    <div className="space-y-2">
                      {data.riskEvaluation.risks.map((risk: any, riskIdx: number) => (
                        <div key={riskIdx} className="bg-white p-3 rounded border border-red-200">
                          <div className="font-semibold text-sm mb-2">{risk.risk}</div>
                          <div className="flex items-center gap-4 mb-2 text-xs">
                            <span className="text-gray-600">
                              Probability: <span className={`font-bold ${
                                risk.probability === 'High' ? 'text-red-600' :
                                risk.probability === 'Medium' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>{risk.probability}</span>
                            </span>
                            <span className="text-gray-600">
                              Impact: <span className={`font-bold ${
                                risk.impact === 'High' ? 'text-red-600' :
                                risk.impact === 'Medium' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>{risk.impact}</span>
                            </span>
                          </div>
                          <div className="text-xs text-gray-700">Mitigation: {risk.mitigation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tollgates */}
                {data.tollgates && (
                  <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.tollgates.title}</h5>
                    <div className="space-y-2">
                      {data.tollgates.gates.map((gate: any, gateIdx: number) => (
                        <div key={gateIdx} className="bg-white p-3 rounded border border-orange-200 flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                            gate.status === 'Complete' ? 'bg-green-500' :
                            gate.status === 'Pending' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}>
                            {gate.status === 'Complete' ? '✓' : gateIdx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{gate.gate}</span>
                              <span className="text-xs text-gray-600">{gate.date}</span>
                            </div>
                            <div className="text-xs text-gray-600">{gate.criteria}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Readiness Checks */}
                {data.readinessChecks && (
                  <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.readinessChecks.title}</h5>
                    <div className="space-y-2">
                      {data.readinessChecks.checks.map((check: any, checkIdx: number) => (
                        <div key={checkIdx} className="bg-white p-3 rounded border border-indigo-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-semibold text-sm">{check.check}</div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              check.status === 'On Track' ? 'bg-green-100 text-green-700' :
                              check.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {check.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Target: {check.target}</div>
                            <div>Current: {check.current}</div>
                            <div className="text-gray-500">Owner: {check.owner}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Handoffs */}
                {data.handoffs && (
                  <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.handoffs.title}</h5>
                    <div className="space-y-2">
                      {data.handoffs.handoffs.map((handoff: any, handoffIdx: number) => (
                        <div key={handoffIdx} className="bg-white p-3 rounded border border-pink-200 flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm font-semibold text-gray-700">{handoff.from}</span>
                            <span className="text-pink-600">→</span>
                            <span className="text-sm font-semibold text-gray-700">{handoff.to}</span>
                          </div>
                          <span className="text-xs text-gray-600">{handoff.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Governance Alignment */}
                {data.governanceAlignment && (
                  <div className="border-l-4 border-gray-500 bg-gray-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.governanceAlignment.title}</h5>
                    <div className="space-y-2">
                      {data.governanceAlignment.requirements.map((req: any, reqIdx: number) => (
                        <div key={reqIdx} className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-sm font-semibold">{req.requirement}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              req.status === 'Complete' ? 'bg-green-100 text-green-700' :
                              req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">{req.evidence}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI-Powered Build */}
            {data.type === 'aidlc' && (
              <div className="space-y-6">
                {/* UI Structure */}
                {data.uiStructure && (
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-1">{data.uiStructure.title}</h5>
                    <p className="text-xs text-gray-600 mb-3 italic">{data.uiStructure.note}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {data.uiStructure.screens.map((screen: any, screenIdx: number) => (
                        <div key={screenIdx} className="bg-white p-3 rounded border border-blue-200">
                          <div className="font-semibold text-sm mb-2">{screen.name}</div>
                          <div className="text-xs text-gray-600 mb-2">{screen.useCase}</div>
                          <div className="space-y-1">
                            {screen.components.map((comp: string, compIdx: number) => (
                              <div key={compIdx} className="text-xs bg-purple-50 px-2 py-1 rounded">{comp}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Derivations */}
                {data.codeDerivations && (
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-1">{data.codeDerivations.title}</h5>
                    <p className="text-xs text-gray-600 mb-3 italic">{data.codeDerivations.note}</p>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border border-green-200">
                        <div className="font-semibold text-sm mb-2">Frontend ({data.codeDerivations.frontend.repo})</div>
                        <div className="space-y-1">
                          {data.codeDerivations.frontend.files.map((file: any, fileIdx: number) => (
                            <div key={fileIdx} className="text-xs flex justify-between items-center py-1">
                              <span className="font-mono text-gray-700">{file.path}</span>
                              <span className="text-gray-500">{file.lines} lines from {file.source}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs font-bold mt-2 text-green-700">Total: {data.codeDerivations.frontend.total} lines</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200">
                        <div className="font-semibold text-sm mb-2">Backend ({data.codeDerivations.backend.repo})</div>
                        <div className="space-y-1">
                          {data.codeDerivations.backend.files.map((file: any, fileIdx: number) => (
                            <div key={fileIdx} className="text-xs flex justify-between items-center py-1">
                              <span className="font-mono text-gray-700">{file.path}</span>
                              <span className="text-gray-500">{file.lines} lines from {file.source}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs font-bold mt-2 text-green-700">Total: {data.codeDerivations.backend.total} lines</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Building Blocks */}
                {data.buildingBlocks && (
                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-1">{data.buildingBlocks.title}</h5>
                    <p className="text-xs text-gray-600 mb-3 italic">{data.buildingBlocks.note}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {data.buildingBlocks.blocks.map((block: any, blockIdx: number) => (
                        <div key={blockIdx} className="bg-white p-3 rounded border border-purple-200 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-sm">{block.name}</div>
                            <div className="text-xs text-gray-600">{block.type} • {block.usage}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            block.reusability === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {block.reusability}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PR Generation */}
                {data.prGeneration && (
                  <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-1">{data.prGeneration.title}</h5>
                    <p className="text-xs text-gray-600 mb-3 italic">{data.prGeneration.note}</p>
                    <div className="space-y-3">
                      {data.prGeneration.prs.map((pr: any, prIdx: number) => (
                        <div key={prIdx} className="bg-white p-4 rounded border border-indigo-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-mono text-sm font-bold">{pr.id}</span>
                              <span className="text-sm font-semibold ml-2">{pr.title}</span>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{pr.status}</span>
                          </div>
                          <ul className="space-y-1 mb-2">
                            {pr.features.map((feature: string, featureIdx: number) => (
                              <li key={featureIdx} className="text-xs text-gray-700 flex items-start gap-2">
                                <span className="text-indigo-600">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="text-xs text-gray-600">{pr.files} files • +{pr.additions} -{pr.deletions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Automated Tests */}
                {data.automatedTests && (
                  <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-1">{data.automatedTests.title}</h5>
                    <p className="text-xs text-gray-600 mb-3 italic">{data.automatedTests.note}</p>
                    
                    {/* Test Coverage Donut Chart */}
                    <div className="bg-white p-6 rounded border border-orange-200 mb-4">
                      <div className="text-xs font-semibold text-gray-600 mb-4">TEST COVERAGE BREAKDOWN</div>
                      <div className="flex items-center gap-8">
                        {/* Donut Chart */}
                        <div className="relative w-40 h-40 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20"></circle>
                            {/* Passed tests arc (89%) */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="20"
                              strokeDasharray="223.7 251.2"
                              strokeLinecap="round"
                            ></circle>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-bold text-green-600">89%</div>
                            <div className="text-xs text-gray-600">Coverage</div>
                          </div>
                        </div>
                        {/* Legend */}
                        <div className="flex-1 space-y-2">
                          {data.automatedTests.testSuites.map((suite: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  idx === 0 ? 'bg-blue-500' :
                                  idx === 1 ? 'bg-green-500' :
                                  idx === 2 ? 'bg-purple-500' :
                                  'bg-orange-500'
                                }`}></div>
                                <span className="text-xs font-medium">{suite.suite}</span>
                              </div>
                              <div className="text-xs font-semibold">{suite.count} tests</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {data.automatedTests.testSuites.map((suite: any, suiteIdx: number) => (
                        <div key={suiteIdx} className="bg-white p-3 rounded border border-orange-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm">{suite.suite}</span>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{suite.count} tests</span>
                              {suite.coverage && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{suite.coverage} coverage</span>
                              )}
                            </div>
                          </div>
                          <ul className="space-y-1">
                            {suite.tests.slice(0, 3).map((test: string, testIdx: number) => (
                              <li key={testIdx} className="text-xs text-gray-700">• {test}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-3 rounded border-2 border-orange-300">
                      <div className="font-bold text-sm">Summary: {data.automatedTests.summary.total} total • {data.automatedTests.summary.passed} passed • {data.automatedTests.summary.failed} failed • {data.automatedTests.summary.coverage} coverage</div>
                    </div>
                  </div>
                )}

                {/* Developer View */}
                {data.developerView && (
                  <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-1">{data.developerView.title}</h5>
                    <p className="text-xs text-gray-600 mb-3 italic">{data.developerView.note}</p>
                    <div className="space-y-2">
                      {data.developerView.capabilities.map((cap: any, capIdx: number) => (
                        <div key={capIdx} className="bg-white p-3 rounded border border-pink-200">
                          <div className="font-semibold text-sm mb-1">{cap.action}</div>
                          <div className="font-mono text-xs bg-gray-900 text-green-400 p-2 rounded mb-1">$ {cap.command}</div>
                          <div className="text-xs text-gray-600">{cap.result}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Full Traceability */}
            {data.type === 'receipts' && (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 italic">{data.note}</p>

                {/* Trace Flow */}
                {data.traceFlow && (
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-2">{data.traceFlow.title}</h5>
                    <div className="text-sm font-semibold mb-2">{data.traceFlow.flow}</div>
                    <div className="font-mono text-xs leading-relaxed bg-white p-3 rounded border border-blue-200 mb-4">{data.traceFlow.fullTrace}</div>
                    
                    {/* Timeline Visualization for Traceability */}
                    <div className="bg-white p-4 rounded border border-blue-200">
                      <div className="text-xs font-semibold text-gray-600 mb-3">DEPLOYMENT TIMELINE</div>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                        {[
                          { time: '09:23', stage: 'Code Generated', status: 'complete', color: 'bg-green-500' },
                          { time: '09:27', stage: 'Tests Generated', status: 'complete', color: 'bg-green-500' },
                          { time: '09:30', stage: 'All Tests Passed', status: 'complete', color: 'bg-green-500' },
                          { time: '14:30', stage: 'PRs Merged', status: 'complete', color: 'bg-green-500' },
                          { time: '17:15', stage: 'Build Success', status: 'complete', color: 'bg-green-500' },
                          { time: '18:00', stage: 'Deployed to Prod', status: 'complete', color: 'bg-blue-500' }
                        ].map((event, idx) => (
                          <div key={idx} className="relative pl-12 pb-6 last:pb-0">
                            <div className={`absolute left-0 top-0 w-8 h-8 ${event.color} text-white rounded-full flex items-center justify-center font-bold text-xs z-10`}>
                              ✓
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold">{event.stage}</span>
                                <span className="text-xs text-gray-500">{event.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 text-center">
                        Total Duration: 8h 37m • Zero downtime deployment
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Receipts */}
                {data.receipts && (
                  <div className="space-y-4">
                    <h5 className="font-bold text-xl">{data.receipts.title}</h5>
                    
                    {/* Receipt Categories Overview Chart */}
                    <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                      <div className="text-sm font-semibold text-gray-700 mb-4">📋 Receipt Categories Overview</div>
                      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                        {data.receipts.categories.map((category: any, idx: number) => {
                          const icons = ['💻', '🧪', '✅', '🔀', '🔗', '⚠️', '🚀']
                          const colors = ['bg-blue-500', 'bg-green-500', 'bg-emerald-500', 'bg-purple-500', 'bg-indigo-500', 'bg-orange-500', 'bg-pink-500']
                          return (
                            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className={`w-12 h-12 ${colors[idx]} text-white rounded-full flex items-center justify-center text-xl mx-auto mb-2`}>
                                {icons[idx]}
                              </div>
                              <div className="text-lg font-bold">{category.receipts.length}</div>
                              <div className="text-xs text-gray-600 leading-tight">{category.category.split(' ')[0]}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Test Results Visualization */}
                    <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                      <div className="text-sm font-semibold text-gray-700 mb-4">✅ Test Execution Results</div>
                      <div className="space-y-3">
                        {[
                          { suite: 'Unit Tests', passed: 32, failed: 0, duration: '4.2s', color: 'bg-blue-500' },
                          { suite: 'Integration Tests', passed: 12, failed: 0, duration: '18.7s', color: 'bg-green-500' },
                          { suite: 'E2E Tests', passed: 3, failed: 0, duration: '45.3s', color: 'bg-purple-500' }
                        ].map((test, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{test.suite}</span>
                              <span className="text-xs text-gray-600">{test.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`${test.color} h-6 flex items-center justify-end px-2 rounded-full`}
                                  style={{ width: '100%' }}
                                >
                                  <span className="text-white text-xs font-bold">{test.passed} passed</span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-green-600">100%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                        <span className="text-sm font-semibold">Total: </span>
                        <span className="text-lg font-bold text-green-600">47/47 passed</span>
                        <span className="text-sm text-gray-600 ml-2">• 89% coverage</span>
                      </div>
                    </div>

                    {/* API Dependency Health Chart */}
                    <div className="bg-white border-2 border-indigo-200 rounded-xl p-6">
                      <div className="text-sm font-semibold text-gray-700 mb-4">🔗 API Dependency Health</div>
                      <div className="space-y-3">
                        {[
                          { name: 'Payment Service v3', calls: 1247, latency: 1.2, target: 1.5, health: 100 },
                          { name: 'Promo Engine', calls: 456, latency: 0.4, target: 0.5, health: 100 },
                          { name: 'Localization Service', calls: 2341, latency: 0.15, target: 0.2, health: 100 }
                        ].map((api, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-indigo-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm">{api.name}</span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                {api.health}% Healthy
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <div className="text-gray-500">Calls</div>
                                <div className="font-bold">{api.calls}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Avg Latency</div>
                                <div className="font-bold text-green-600">{api.latency}s</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Target</div>
                                <div className="font-bold">&lt;{api.target}s</div>
                              </div>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(api.latency / api.target) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {data.receipts.categories.map((category: any, catIdx: number) => (
                      <div key={catIdx} className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                        <h6 className="font-bold text-md mb-3">{category.category}</h6>
                        <div className="space-y-2 mb-3">
                          {category.receipts.map((receipt: any, recIdx: number) => (
                            <div key={recIdx} className="bg-white p-3 rounded border border-purple-200 text-xs">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-gray-600">{receipt.timestamp}</span>
                                {receipt.result && (
                                  <span className={`px-2 py-1 rounded font-bold ${
                                    receipt.result === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {receipt.result}
                                  </span>
                                )}
                                {receipt.status && (
                                  <span className={`px-2 py-1 rounded font-bold ${
                                    receipt.status === 'Success' ? 'bg-green-100 text-green-700' :
                                    receipt.status === 'Healthy' ? 'bg-green-100 text-green-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {receipt.status}
                                  </span>
                                )}
                              </div>
                              {receipt.action && <div className="font-semibold mb-1">{receipt.action}</div>}
                              {receipt.source && <div className="text-gray-600">Source: {receipt.source}</div>}
                              {receipt.suite && <div className="font-semibold mb-1">{receipt.suite}</div>}
                              {receipt.passed !== undefined && (
                                <div className="text-gray-600">Passed: {receipt.passed}/{receipt.passed + receipt.failed} • Coverage: {receipt.coverage} • Duration: {receipt.duration}</div>
                              )}
                              {receipt.pr && (
                                <div>
                                  <div className="font-semibold">{receipt.pr}: {receipt.title}</div>
                                  <div className="text-gray-600">Reviewed by: {receipt.reviewers} • Merged by: {receipt.merged_by}</div>
                                </div>
                              )}
                              {receipt.system && (
                                <div>
                                  <div className="font-semibold">{receipt.system} - {receipt.endpoint}</div>
                                  <div className="text-gray-600">{receipt.calls} calls • Avg latency: {receipt.avg_latency} • Linked to: {receipt.linked_to}</div>
                                </div>
                              )}
                              {receipt.exception && (
                                <div>
                                  <div className="font-semibold">{receipt.exception} (x{receipt.count})</div>
                                  <div className="text-gray-600">Severity: {receipt.severity} • Resolution: {receipt.resolution}</div>
                                </div>
                              )}
                              {receipt.stage && (
                                <div>
                                  <div className="font-semibold">{receipt.stage}</div>
                                  <div className="text-gray-600">Duration: {receipt.duration} • Environment: {receipt.environment || 'N/A'}</div>
                                </div>
                              )}
                              {receipt.hash && <div className="text-gray-500 font-mono">{receipt.hash}</div>}
                            </div>
                          ))}
                        </div>
                        <div className="text-xs font-semibold text-purple-700 bg-white p-2 rounded border border-purple-300">{category.total || category.summary}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Compliance */}
                {data.compliance && (
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.compliance.title}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {data.compliance.checks.map((check: any, checkIdx: number) => (
                        <div key={checkIdx} className="bg-white p-3 rounded border border-green-200 flex items-start gap-3">
                          <div className="text-2xl text-green-600">✅</div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{check.standard}</div>
                            <div className="text-xs text-gray-600">Verified: {check.verified}</div>
                            <div className="text-xs text-gray-600">Auditor: {check.auditor}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Continuous Learning & Feedback */}
            {data.type === 'operational' && currentStep === 'learn' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 italic">{data.note}</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{data.timeframe}</span>
                </div>

                {/* Performance Metrics */}
                {data.performanceMetrics && (
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.performanceMetrics.title}</h5>
                    
                    {/* Before/After Comparison Chart */}
                    <div className="bg-white p-4 rounded border border-green-200 mb-4">
                      <div className="text-xs font-semibold text-gray-600 mb-3">BEFORE vs AFTER COMPARISON</div>
                      <div className="grid grid-cols-3 gap-6">
                        {data.performanceMetrics.metrics.slice(0, 3).map((metric: any, idx: number) => {
                          const isImproving = metric.trend === 'down' || (metric.trend === 'up' && metric.status === 'exceeded')
                          
                          return (
                            <div key={idx} className="text-center">
                              <div className="text-xs font-medium mb-3 h-10 flex items-center justify-center px-2">{metric.name}</div>
                              <div className="flex justify-center gap-4 mb-3">
                                <div className="w-20">
                                  <div className="h-32 bg-gray-100 rounded flex items-end justify-center p-2">
                                    <div className="w-12 bg-red-400 rounded-t" style={{ height: '75%' }}></div>
                                  </div>
                                  <div className="text-sm font-bold mt-2">{metric.before}</div>
                                  <div className="text-xs text-gray-500">Before</div>
                                </div>
                                <div className="w-20">
                                  <div className="h-32 bg-gray-100 rounded flex items-end justify-center p-2">
                                    <div className={`w-12 ${isImproving ? 'bg-green-500' : 'bg-yellow-500'} rounded-t`} style={{ height: '45%' }}></div>
                                  </div>
                                  <div className="text-sm font-bold mt-2">{metric.after}</div>
                                  <div className="text-xs text-gray-500">After</div>
                                </div>
                              </div>
                              <div className={`text-xs font-bold px-2 py-1 rounded ${isImproving ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {metric.change}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {data.performanceMetrics.metrics.map((metric: any, metricIdx: number) => (
                        <div key={metricIdx} className="bg-white p-3 rounded border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">{metric.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded font-bold ${
                                metric.trend === 'up' && metric.status !== 'exceeded' ? 'bg-red-100 text-red-700' :
                                metric.trend === 'down' ? 'bg-green-100 text-green-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded font-bold ${
                                metric.status === 'exceeded' ? 'bg-green-100 text-green-700' :
                                metric.status === 'improving' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {metric.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>Before: <strong className="text-red-600">{metric.before}</strong></span>
                            <span>→</span>
                            <span>After: <strong className="text-green-600">{metric.after}</strong></span>
                            <span>•</span>
                            <span>Target: <strong className="text-blue-600">{metric.target}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-3 rounded border border-green-300 text-xs text-gray-600 italic">{data.performanceMetrics.chartData}</div>
                  </div>
                )}

                {/* Operational Issues */}
                {data.operationalIssues && (
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.operationalIssues.title}</h5>
                    <div className="space-y-3">
                      {data.operationalIssues.categories.map((category: any, catIdx: number) => (
                        <div key={catIdx} className="bg-white p-3 rounded border border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">{category.category}</span>
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">{category.count} issues</span>
                          </div>
                          <div className="space-y-2">
                            {category.issues.map((issue: any, issueIdx: number) => (
                              <div key={issueIdx} className="p-2 bg-gray-50 rounded text-xs">
                                <div className="font-semibold mb-1">{issue.issue || issue.test || issue.area || issue.feature}</div>
                                {issue.frequency && <div className="text-gray-600">Frequency: {issue.frequency}</div>}
                                {issue.impact && <div className="text-gray-600">Impact: {issue.impact}</div>}
                                {issue.root_cause && <div className="text-gray-600">Root cause: {issue.root_cause}</div>}
                                {issue.pattern && <div className="text-gray-600">Pattern: {issue.pattern}</div>}
                                {issue.feedback && <div className="text-gray-600 italic">Feedback: {issue.feedback}</div>}
                                {issue.cause && <div className="text-gray-600">Cause: {issue.cause}</div>}
                                {issue.hypothesis && <div className="text-gray-600">Hypothesis: {issue.hypothesis}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Signals */}
                {data.newSignals && (
                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.newSignals.title}</h5>
                    <div className="space-y-2">
                      {data.newSignals.signals.map((signal: any, signalIdx: number) => (
                        <div key={signalIdx} className="bg-white p-3 rounded border border-purple-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">{signal.signal}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              signal.priority === 'P0' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {signal.priority}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            Source: {signal.source} • Count: {signal.count} • {signal.sentiment || signal.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visualizations with Actual Charts */}
                {data.visualizations && (
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.visualizations.title}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Line Chart - Cart Abandonment */}
                      <div className="bg-white p-4 rounded border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">📈</span>
                          <div>
                            <div className="font-semibold text-sm">Cart Abandonment Rate (30 days)</div>
                            <div className="text-xs text-gray-500">Line Chart</div>
                          </div>
                        </div>
                        <div className="h-32 flex items-end justify-between gap-2">
                          {[68, 65, 58, 52, 48, 43].map((value, idx) => {
                            const heightPercent = ((68 - value) / 68) * 100
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center">
                                <div className="flex-1 flex items-end w-full">
                                  <div className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t" style={{ height: `${heightPercent + 20}%` }}></div>
                                </div>
                                <div className="text-xs font-bold mt-1">{value}%</div>
                                <div className="text-xs text-gray-500">W{idx+1}</div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="text-xs text-green-600 font-semibold mt-2">↓ Decreasing trend</div>
                      </div>

                      {/* Bar Chart - Support Tickets */}
                      <div className="bg-white p-4 rounded border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">📊</span>
                          <div>
                            <div className="font-semibold text-sm">Support Ticket Volume</div>
                            <div className="text-xs text-gray-500">Bar Chart</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: 'Payment timeout', value: 560, color: 'bg-red-500' },
                            { label: 'Promo issues', value: 420, color: 'bg-orange-500' },
                            { label: 'Localization', value: 240, color: 'bg-yellow-500' },
                            { label: 'Other', value: 200, color: 'bg-gray-400' }
                          ].map((item, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-xs mb-1">
                                <span>{item.label}</span>
                                <span className="font-bold">{item.value}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className={`${item.color} h-4 rounded-full`} style={{ width: `${(item.value / 560) * 100}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Funnel Chart */}
                      <div className="bg-white p-4 rounded border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🔽</span>
                          <div>
                            <div className="font-semibold text-sm">Checkout Conversion Funnel</div>
                            <div className="text-xs text-gray-500">Funnel Chart</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[
                            { stage: 'Cart', percent: 100, color: 'bg-blue-500' },
                            { stage: 'Checkout', percent: 78, color: 'bg-blue-400' },
                            { stage: 'Payment', percent: 65, color: 'bg-yellow-500' },
                            { stage: 'Confirmation', percent: 57, color: 'bg-green-500' }
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-20 text-xs font-medium">{item.stage}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-8 flex items-center overflow-hidden">
                                <div className={`${item.color} h-8 flex items-center justify-end px-2`} style={{ width: `${item.percent}%` }}>
                                  <span className="text-white text-xs font-bold">{item.percent}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-red-600 font-semibold mt-2">Largest drop: Payment → Confirmation (8%)</div>
                      </div>

                      {/* Pie Chart - Device Distribution */}
                      <div className="bg-white p-4 rounded border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🥧</span>
                          <div>
                            <div className="font-semibold text-sm">Device Distribution</div>
                            <div className="text-xs text-gray-500">Pie Chart</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              {/* Android 62% */}
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="155 251"></circle>
                              {/* iOS 28% */}
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="70 251" strokeDashoffset="-155"></circle>
                              {/* Desktop 10% */}
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="26 251" strokeDashoffset="-225"></circle>
                            </svg>
                          </div>
                          <div className="flex-1 space-y-1">
                            {[
                              { label: 'Android', percent: '62%', color: 'bg-green-500' },
                              { label: 'iOS', percent: '28%', color: 'bg-blue-500' },
                              { label: 'Desktop', percent: '10%', color: 'bg-yellow-500' }
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="flex-1">{item.label}</span>
                                <span className="font-bold">{item.percent}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 italic mt-2">Low-end Android (2GB RAM) = 8% of total, 25% of errors</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Iterations */}
                {data.nextIterations && (
                  <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
                    <h5 className="font-bold text-lg mb-3">{data.nextIterations.title}</h5>
                    <div className="space-y-3">
                      {data.nextIterations.initiatives.map((initiative: any, initIdx: number) => (
                        <div key={initIdx} className="bg-white p-4 rounded border border-indigo-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-semibold text-sm">{initIdx + 1}. {initiative.title}</span>
                              <div className="flex gap-2 mt-1">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  initiative.priority === 'P0' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {initiative.priority}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  initiative.effort === 'S' ? 'bg-green-100 text-green-700' :
                                  initiative.effort === 'M' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {initiative.effort} effort
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  initiative.confidence === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {initiative.confidence} confidence
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-700 mb-2">{initiative.rationale}</div>
                          <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 p-2 rounded">{initiative.estimated_impact}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar - Figma-like with WIBEY */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={WibeyLogo} alt="Wibey" className="h-8 w-auto" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wibey
            </span>
          </div>
          <span className="text-gray-300">/</span>
          <button
            onClick={() => setShowWorkspaceModal(true)}
            className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
          >
            <span className="font-semibold text-gray-700">{workspaceName}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white" title={currentUser.name}>
              {currentUser.name[0]}
            </div>
            {collaborators.slice(0, 2).map((collab, idx) => (
              <div key={idx} className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white" title={collab.email}>
                {collab.name[0].toUpperCase()}
              </div>
            ))}
            {collaborators.length > 2 && (
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white">
                +{collaborators.length - 2}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              {currentUser.name[0]}
            </div>
            <span className="text-sm font-medium">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Chat (32%) */}
        <div className="w-[32%] border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
              <div key={msg.id}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role !== 'system' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        msg.role === 'assistant' ? 'bg-white border-2 border-blue-600' : 'bg-gray-700 text-white'
                      }`}>
                        {msg.role === 'assistant' ? (
                          <img src={WibeyLogo} alt="Wibey" className="w-6 h-6" />
                        ) : (
                          'PM'
                        )}
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user' ? 'bg-gray-700 text-white' :
                      msg.role === 'system' ? 'bg-purple-50 border border-purple-200 text-purple-900' :
                      'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                      <span className="text-xs opacity-60 mt-2 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 ml-11">
                    {msg.actionButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAction(btn.action)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          btn.primary
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                    <img src={WibeyLogo} alt="Wibey" className="w-6 h-6" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-gray-100">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">📎</button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Wibey..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right - Canvas (68%) */}
        <div ref={canvasRef} className="flex-1 bg-gray-50 overflow-auto p-6">
          {renderCanvas()}
        </div>
      </div>

      {/* Workspace Settings Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Workspace Settings</h3>
              <button onClick={() => setShowWorkspaceModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g., Mobile Checkout Optimization"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Collaborators</label>
                <div className="flex gap-2 mb-3">
                  <input
                    id="collab-email"
                    type="email"
                    placeholder="email@company.com"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select id="collab-role" className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  <button
                    onClick={() => {
                      const emailInput = document.getElementById('collab-email') as HTMLInputElement
                      const roleSelect = document.getElementById('collab-role') as HTMLSelectElement
                      if (emailInput.value) {
                        handleAddCollaborator(emailInput.value, roleSelect.value as 'Editor' | 'Viewer')
                        emailInput.value = ''
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {collaborators.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {collaborators.map((collab, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {collab.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{collab.email}</div>
                            <div className="text-xs text-gray-500">{collab.role}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setCollaborators(prev => prev.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-600 text-xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowWorkspaceModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowWorkspaceModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
