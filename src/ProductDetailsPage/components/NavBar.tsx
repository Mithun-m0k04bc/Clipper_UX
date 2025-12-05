export default function NavBar() {
  return (
    <nav className="w-20 h-full bg-[#0052CC] flex flex-col items-center py-4">
      {/* Logo */}
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <NavItem icon="people" label="People" />
        <NavItem icon="products" label="Products" active />
        <NavItem icon="initiatives" label="Initiatives" />
      </div>

      {/* Bottom Items */}
      <div className="flex flex-col items-center gap-2">
        <NavItem icon="manager" label="Manager" />
        <NavItem icon="help" label="Help Docs" />
      </div>
    </nav>
  )
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  const icons: Record<string, React.ReactElement> = {
    people: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    products: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    initiatives: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l8 5v6l-8 5-8-5V7l8-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    manager: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    help: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 8a2 2 0 113 1.7c-.5.4-1 .8-1 1.3v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="14" r="0.5" fill="currentColor"/>
      </svg>
    ),
  }

  return (
    <div className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-colors ${
      active ? 'bg-white/20' : 'hover:bg-white/10'
    }`}>
      <div className={`${active ? 'text-white' : 'text-white/70'}`}>
        {icons[icon]}
      </div>
      <span className={`text-[10px] ${active ? 'text-white font-medium' : 'text-white/70'}`}>
        {label}
      </span>
    </div>
  )
}

