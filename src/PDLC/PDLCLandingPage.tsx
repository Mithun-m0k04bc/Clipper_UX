import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePDLC } from './context/PDLCContext'

export default function PDLCLandingPage() {
  const navigate = useNavigate()
  const { workspaces, createWorkspace, selectWorkspace, deleteWorkspace } = usePDLC()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('')

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || workspace.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return
    const workspaceId = createWorkspace(newWorkspaceName, newWorkspaceDescription)
    setNewWorkspaceName('')
    setNewWorkspaceDescription('')
    setShowCreateModal(false)
    selectWorkspace(workspaceId)
    navigate('/pdlc/workspace')
  }

  const handleSelectWorkspace = (workspaceId: string) => {
    selectWorkspace(workspaceId)
    navigate('/pdlc/workspace')
  }

  const handleDeleteWorkspace = (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      deleteWorkspace(workspaceId)
    }
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Unified PDLC</h1>
          <p className="text-sm text-gray-500">Product Development Lifecycle Management</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Workspace
        </button>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {['All', 'Draft', 'In Progress', 'Review', 'Approved', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[140px_1fr_140px_140px_180px_140px_140px] bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Workspace Name</div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Modified</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => handleSelectWorkspace(workspace.id)}
                className="grid grid-cols-[140px_1fr_140px_140px_180px_140px_140px] px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="text-sm font-semibold text-gray-900">{workspace.id.split('-')[1]}</div>
                <div className="text-sm text-gray-900 font-medium">
                  <div>{workspace.name}</div>
                  {workspace.description && (
                    <div className="text-xs text-gray-500 mt-1">{workspace.description}</div>
                  )}
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStageColor(workspace.lastStage)}`}>
                    {getStageLabel(workspace.lastStage)}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(workspace.status)}`}>
                    {workspace.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700">{workspace.owner}</div>
                <div className="text-sm text-gray-500">{new Date(workspace.createdDate).toLocaleDateString()}</div>
                <div className="text-sm text-gray-500 flex items-center justify-between">
                  <span>{new Date(workspace.lastModified).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => handleDeleteWorkspace(e, workspace.id)}
                    className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-600 hover:text-red-800 transition-opacity"
                    title="Delete workspace"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkspaces.length === 0 && (
            <div className="py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No workspaces found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new workspace.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Workspace
                </button>
              </div>
            </div>
          )}
        </div>
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
    </div>
  )
}
