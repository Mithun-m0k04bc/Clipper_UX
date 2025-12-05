import { useState } from 'react'

interface TeamMember {
  id: string
  name: string
  initials: string
  color: string
  role: string
  allocation: number
  type: 'FTE' | 'Contractor' | 'Consultant'
  team: string
  skills: string[]
  status: 'Active' | 'On Leave' | 'Ending Soon'
}

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Jordyn Saris', initials: 'JS', color: 'bg-purple-400', role: 'VP - Developer Productivity', allocation: 100, type: 'FTE', team: 'Leadership', skills: ['Strategy', 'Management'], status: 'Active' },
  { id: '2', name: 'Kaiya Schleifer', initials: 'KS', color: 'bg-orange-400', role: 'UX Lead', allocation: 100, type: 'FTE', team: 'Design', skills: ['UX Design', 'Research'], status: 'Active' },
  { id: '3', name: 'Mira Schleifer', initials: 'MS', color: 'bg-teal-400', role: 'Sr. Manager Engineering', allocation: 100, type: 'FTE', team: 'Engineering', skills: ['Engineering', 'Architecture'], status: 'Active' },
  { id: '4', name: 'Alex Chen', initials: 'AC', color: 'bg-blue-400', role: 'Senior Engineer', allocation: 100, type: 'FTE', team: 'Engineering', skills: ['React', 'Node.js', 'AWS'], status: 'Active' },
  { id: '5', name: 'Sarah Kim', initials: 'SK', color: 'bg-pink-400', role: 'Product Designer', allocation: 80, type: 'FTE', team: 'Design', skills: ['Figma', 'Prototyping'], status: 'Active' },
  { id: '6', name: 'Marcus Johnson', initials: 'MJ', color: 'bg-indigo-400', role: 'DevOps Engineer', allocation: 100, type: 'FTE', team: 'Engineering', skills: ['Kubernetes', 'CI/CD', 'Terraform'], status: 'Active' },
  { id: '7', name: 'Emily Davis', initials: 'ED', color: 'bg-green-400', role: 'Backend Developer', allocation: 100, type: 'Contractor', team: 'Engineering', skills: ['Java', 'Spring Boot', 'PostgreSQL'], status: 'Ending Soon' },
  { id: '8', name: 'David Park', initials: 'DP', color: 'bg-yellow-400', role: 'Frontend Developer', allocation: 75, type: 'Contractor', team: 'Engineering', skills: ['React', 'TypeScript'], status: 'Active' },
  { id: '9', name: 'Lisa Wang', initials: 'LW', color: 'bg-red-400', role: 'Data Analyst', allocation: 50, type: 'Consultant', team: 'Analytics', skills: ['SQL', 'Python', 'Looker'], status: 'Active' },
  { id: '10', name: 'James Wilson', initials: 'JW', color: 'bg-cyan-400', role: 'QA Engineer', allocation: 100, type: 'FTE', team: 'Engineering', skills: ['Testing', 'Automation'], status: 'On Leave' },
]

function DonutChart({ data, total, label }: { data: { value: number; color: string; label: string }[]; total: number; label: string }) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0
  const gradientStops = data.map((item) => {
    const percentage = (item.value / totalValue) * 100
    const start = currentAngle
    currentAngle += percentage
    return `${item.color} ${start}% ${currentAngle}%`
  }).join(', ')

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[160px] h-[160px]">
        <div 
          className="w-full h-full rounded-full"
          style={{ background: `conic-gradient(${gradientStops})` }}
        />
        <div className="absolute inset-5 bg-white rounded-full flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{total}</span>
          <span className="text-sm text-gray-500">{label}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamMemberRow({ member }: { member: TeamMember }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${member.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
            {member.initials}
          </div>
          <div>
            <div className="font-medium text-gray-900">{member.name}</div>
            <div className="text-xs text-gray-500">{member.role}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          member.type === 'FTE' ? 'bg-blue-100 text-blue-700' :
          member.type === 'Contractor' ? 'bg-orange-100 text-orange-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {member.type}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{member.team}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${member.allocation}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{member.allocation}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1 flex-wrap">
          {member.skills.slice(0, 2).map((skill) => (
            <span key={skill} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
              {skill}
            </span>
          ))}
          {member.skills.length > 2 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">
              +{member.skills.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          member.status === 'Active' ? 'bg-green-100 text-green-700' :
          member.status === 'On Leave' ? 'bg-gray-100 text-gray-600' :
          'bg-red-100 text-red-600'
        }`}>
          {member.status}
        </span>
      </td>
    </tr>
  )
}

export default function PeopleAllocationsTab() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredMembers = filterType === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.type === filterType)

  const allocationByType = [
    { value: 10.9, color: '#3B82F6', label: 'Full Time Associates' },
    { value: 4.3, color: '#14B8A6', label: 'Consultants' },
    { value: 1, color: '#F97316', label: 'Contractors' },
  ]

  const allocationByTeam = [
    { value: 7, color: '#3B82F6', label: 'Engineering' },
    { value: 3, color: '#8B5CF6', label: 'Design' },
    { value: 2, color: '#10B981', label: 'Leadership' },
    { value: 1, color: '#F59E0B', label: 'Analytics' },
  ]

  const typeCounts = {
    FTE: teamMembers.filter(m => m.type === 'FTE').length,
    Contractor: teamMembers.filter(m => m.type === 'Contractor').length,
    Consultant: teamMembers.filter(m => m.type === 'Consultant').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">People Allocations</h2>
          <p className="text-sm text-gray-500 mt-1">Manage team composition and resource allocation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline mr-1">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline mr-1">
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Grid
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Add Member
          </button>
        </div>
      </div>

      {/* Summary Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Allocation by Type</h3>
          <DonutChart data={allocationByType} total={16} label="People" />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Allocation by Team</h3>
          <DonutChart data={allocationByTeam} total={13} label="People" />
        </div>
      </div>

      {/* Stacked Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Headcount Distribution</h3>
          <span className="text-sm text-gray-500">Total: 16 people</span>
        </div>
        <div className="flex h-8 rounded-lg overflow-hidden mb-3">
          <div className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium" style={{ width: '68%' }}>
            10.9 FTE
          </div>
          <div className="bg-teal-500 flex items-center justify-center text-white text-sm font-medium" style={{ width: '20%' }}>
            4.3
          </div>
          <div className="bg-orange-400 flex items-center justify-center text-white text-sm font-medium" style={{ width: '12%' }}>
            1
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-sm text-gray-600">Full Time ({typeCounts.FTE})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-teal-500"></div>
            <span className="text-sm text-gray-600">Consultants ({typeCounts.Consultant})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-400"></div>
            <span className="text-sm text-gray-600">Contractors ({typeCounts.Contractor})</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Filter by type:</span>
        <div className="flex gap-2">
          {['all', 'FTE', 'Contractor', 'Consultant'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members Table/Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Team</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Allocation</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <TeamMemberRow key={member.id} member={member} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-white text-lg font-medium`}>
                  {member.initials}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  member.type === 'FTE' ? 'bg-blue-100 text-blue-700' :
                  member.type === 'Contractor' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {member.type}
                </span>
                <span className="text-gray-500">{member.allocation}% allocation</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

