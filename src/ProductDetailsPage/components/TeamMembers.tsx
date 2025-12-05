import { CheckCircleFillIcon } from './shared/CustomIcons'
import Tag from './shared/Tag'

interface TeamMemberProps {
  role: string
  name: string
  title: string
  initials: string
  color: string
}

const teamMembers: TeamMemberProps[] = [
  { role: 'Product Manager', name: 'Kaiya Schleifer', title: 'UX Lead', initials: 'KS', color: 'bg-orange-400' },
  { role: 'Program Manager', name: 'Mira Schleifer', title: 'Sr. Manager Engineering', initials: 'MS', color: 'bg-teal-400' },
  { role: 'Engineering Manager', name: 'Jordyn Saris', title: 'VP- Developer Productivity', initials: 'JS', color: 'bg-purple-400' },
]

function TeamMember({ role, name, title, initials, color }: TeamMemberProps) {
  return (
    <div className="flex-1">
      <div className="text-xs text-gray-500 mb-2 font-['Bogle',sans-serif]">{role}</div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white text-sm font-medium font-['Bogle',sans-serif]`}>
            {initials}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center">
            <CheckCircleFillIcon size={18} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 text-sm font-['Bogle',sans-serif]">{name}</span>
            <Tag variant="blue">m0k04bc</Tag>
          </div>
          <div className="text-xs text-gray-500 truncate font-['Bogle',sans-serif]">{title}</div>
        </div>
      </div>
    </div>
  )
}

export default function TeamMembers() {
  return (
    <div className="flex gap-6 pb-6 border-b border-gray-200 mb-4">
      {teamMembers.map((member) => (
        <TeamMember key={member.role} {...member} />
      ))}
    </div>
  )
}

