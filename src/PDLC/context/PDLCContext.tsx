import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

export interface PDLCInitiative {
  id: string
  name: string
  description: string
  phase: 'capture' | 'discovery' | 'specification' | 'design' | 'plan' | 'build' | 'trace' | 'feedback'
  status: 'Draft' | 'In Progress' | 'Review' | 'Approved' | 'Completed'
  owner: string
  createdDate: string
  lastModified: string
}

export interface Workspace {
  id: string
  name: string
  description?: string
  createdDate: string
  lastModified: string
  lastStage: 'wibey' | 'capture' | 'discovery' | 'specification' | 'design' | 'plan' | 'build' | 'trace' | 'feedback'
  owner: string
  status: 'Draft' | 'In Progress' | 'Review' | 'Approved' | 'Completed'
  theme?: string
  pdlcData?: PDLCData
}

export interface PDLCData {
  currentStep: number
  signals: {
    prds: string[]
    jiraTickets: string[]
    slackThreads: string[]
    analytics: string[]
    incidents: string[]
    otherInputs: string[]
  }
  problemStatements: string[]
  jobsToBeDone: string[]
  userJourneys: string[]
  personas: Array<{ name: string; description: string; needs: string[] }>
  processFlows: string[]
  risks: Array<{ risk: string; mitigation: string; severity: 'Low' | 'Medium' | 'High' }>
  businessOutcomes: string[]
  specification: {
    title: string
    functionalRequirements: string[]
    nonFunctionalRequirements: string[]
    acceptanceCriteria: string[]
    dependencies: string[]
  }
  uiSkeletons: string[]
  dependencyGraphs: string[]
  technicalAnswers: string[]
  designDecisions: Array<{ decision: string; rationale: string }>
  planning: {
    tasks: Array<{ name: string; dependencies: string[]; estimate: string }>
    sequencing: string[]
    riskEvaluation: string[]
    readinessStatus: 'Not Ready' | 'Partially Ready' | 'Ready'
  }
  buildArtifacts: {
    codeGenerated: boolean
    testsGenerated: boolean
    approved: boolean
    traceabilityLink: string
  }
  auditLog: Array<{
    action: string
    user: string
    timestamp: string
    details: string
  }>
  feedback: {
    errors: string[]
    usage: string[]
    userFeedback: string[]
    improvements: string[]
  }
  initiativeName: string
  initiativeDescription: string
  owner: string
  status: 'Draft' | 'In Progress' | 'Review' | 'Approved' | 'Completed'
}

interface PDLCContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  pdlcData: PDLCData
  updatePDLCData: (data: Partial<PDLCData>) => void
  resetPDLCData: () => void
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  createWorkspace: (name: string, description?: string) => string
  selectWorkspace: (workspaceId: string | null) => void
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void
  deleteWorkspace: (workspaceId: string) => void
  saveWorkspace: () => void
}

const PDLCContext = createContext<PDLCContextType | undefined>(undefined)

const initialPDLCData: PDLCData = {
  currentStep: 1,
  signals: { prds: [], jiraTickets: [], slackThreads: [], analytics: [], incidents: [], otherInputs: [] },
  problemStatements: [],
  jobsToBeDone: [],
  userJourneys: [],
  personas: [],
  processFlows: [],
  risks: [],
  businessOutcomes: [],
  specification: { title: '', functionalRequirements: [], nonFunctionalRequirements: [], acceptanceCriteria: [], dependencies: [] },
  uiSkeletons: [],
  dependencyGraphs: [],
  technicalAnswers: [],
  designDecisions: [],
  planning: { tasks: [], sequencing: [], riskEvaluation: [], readinessStatus: 'Not Ready' },
  buildArtifacts: { codeGenerated: false, testsGenerated: false, approved: false, traceabilityLink: '' },
  auditLog: [],
  feedback: { errors: [], usage: [], userFeedback: [], improvements: [] },
  initiativeName: '',
  initiativeDescription: '',
  owner: '',
  status: 'Draft',
}

const STORAGE_KEY = 'pdlc_workspaces'
const loadWorkspacesFromStorage = (): Workspace[] => { try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) : [] } catch { return [] } }
const saveWorkspacesToStorage = (workspaces: Workspace[]) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces)) } catch (error) { console.error('Failed to save workspaces to storage:', error) } }

export const PDLCProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(loadWorkspacesFromStorage)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)
  const [pdlcData, setPDLCData] = useState<PDLCData>(initialPDLCData)
  const [currentStep, setCurrentStepState] = useState<number>(1)

  const currentWorkspace = useMemo(() => workspaces.find(w => w.id === currentWorkspaceId) || null, [workspaces, currentWorkspaceId])
  const loadedWorkspaceRef = useRef<string | null>(null)

  useEffect(() => {
    if (currentWorkspaceId && loadedWorkspaceRef.current !== currentWorkspaceId) {
      const workspace = workspaces.find(w => w.id === currentWorkspaceId)
      if (workspace && workspace.pdlcData) {
        loadedWorkspaceRef.current = currentWorkspaceId
        setPDLCData(workspace.pdlcData)
        const stageToStep: Record<string, number> = { 'wibey': 0, 'capture': 1, 'discovery': 2, 'specification': 3, 'design': 4, 'plan': 5, 'build': 6, 'trace': 7, 'feedback': 8 }
        const step = stageToStep[workspace.lastStage] || 1
        setCurrentStepState(step)
      }
    } else if (!currentWorkspaceId) {
      loadedWorkspaceRef.current = null
      setPDLCData(initialPDLCData)
      setCurrentStepState(1)
    }
  }, [currentWorkspaceId, workspaces])

  const getStageFromStep = (step: number): Workspace['lastStage'] => {
    const stepToStage: Record<number, Workspace['lastStage']> = { 0: 'wibey', 1: 'capture', 2: 'discovery', 3: 'specification', 4: 'design', 5: 'plan', 6: 'build', 7: 'trace', 8: 'feedback' }
    return stepToStage[step] || 'wibey'
  }

  const updateWorkspaceInState = (workspaceId: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => { const updated = prev.map(w => w.id === workspaceId ? { ...w, ...updates } : w); saveWorkspacesToStorage(updated); return updated })
  }

  const updatePDLCData = useCallback((data: Partial<PDLCData>) => { setPDLCData(prev => ({ ...prev, ...data })) }, [])
  const setCurrentStep = useCallback((step: number) => { setCurrentStepState(step); updatePDLCData({ currentStep: step }) }, [updatePDLCData])
  const resetPDLCData = useCallback(() => { setPDLCData(initialPDLCData); setCurrentStepState(1) }, [])

  const createWorkspace = useCallback((name: string, description?: string): string => {
    const newWorkspace: Workspace = { id: `workspace-${Date.now()}`, name, description, createdDate: new Date().toISOString(), lastModified: new Date().toISOString(), lastStage: 'wibey', owner: 'Current User', status: 'Draft', pdlcData: initialPDLCData }
    setWorkspaces(prev => { const updated = [...prev, newWorkspace]; saveWorkspacesToStorage(updated); return updated })
    setCurrentWorkspaceId(newWorkspace.id)
    return newWorkspace.id
  }, [])

  const selectWorkspace = useCallback((workspaceId: string | null) => { setCurrentWorkspaceId(workspaceId) }, [])
  const updateWorkspace = useCallback((workspaceId: string, updates: Partial<Workspace>) => { updateWorkspaceInState(workspaceId, updates) }, [])
  const deleteWorkspace = useCallback((workspaceId: string) => { setWorkspaces(prev => { const updated = prev.filter(w => w.id !== workspaceId); saveWorkspacesToStorage(updated); return updated }); if (currentWorkspaceId === workspaceId) { setCurrentWorkspaceId(null) } }, [currentWorkspaceId])
  const saveWorkspace = useCallback(() => { if (currentWorkspaceId && currentWorkspace) { updateWorkspaceInState(currentWorkspaceId, { pdlcData, lastModified: new Date().toISOString(), lastStage: getStageFromStep(currentStep) }) } }, [currentWorkspaceId, currentWorkspace, pdlcData, currentStep])

  return (
    <PDLCContext.Provider value={{ currentStep, setCurrentStep, pdlcData, updatePDLCData, resetPDLCData, workspaces, currentWorkspace, createWorkspace, selectWorkspace, updateWorkspace, deleteWorkspace, saveWorkspace }}>
      {children}
    </PDLCContext.Provider>
  )
}

export const usePDLC = () => {
  const context = useContext(PDLCContext)
  if (!context) { throw new Error('usePDLC must be used within a PDLCProvider') }
  return context
}
