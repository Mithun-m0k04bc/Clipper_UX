/* Custom Entity Icons from Figma - Using Inline SVG Components - Updated v2 */

interface IconProps {
  className?: string
  size?: number
}

// Force browser reload - timestamp: 2025-01-04-14:05

// Icon/Org - Blue (#1A7FE0) - Direct from Figma SVG export
export function IconOrg({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <rect width="20" height="20" rx="3" fill="#1A7FE0"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4 6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V14C16 15.1046 15.1046 16 14 16H6C4.89543 16 4 15.1046 4 14V6ZM6 5.5H14C14.2761 5.5 14.5 5.72386 14.5 6V7.5H5.5V6C5.5 5.72386 5.72386 5.5 6 5.5ZM5.5 9H8.5V11H5.5V9ZM10 9H14.5V11H10V9ZM8.5 12.5H5.5V14C5.5 14.2761 5.72386 14.5 6 14.5H8.5V12.5ZM10 14.5V12.5H14.5V14C14.5 14.2761 14.2761 14.5 14 14.5H10Z" fill="white"/>
    </svg>
  )
}

// Icon/Sub-Org - Purple (#73478B) - Direct from Figma SVG export
export function IconSubOrg({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <rect width="20" height="20" rx="3" fill="#73478B"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.5 4.5C6.22386 4.5 6 4.72386 6 5V6.5C6 6.77614 6.22386 7 6.5 7H13.5C13.7761 7 14 6.77614 14 6.5V5C14 4.72386 13.7761 4.5 13.5 4.5H6.5ZM10 8V9H14V10H10.5V11H7.5V10H6V9H10V8ZM4 12C4 11.4477 4.44772 11 5 11H7.5C8.05228 11 8.5 11.4477 8.5 12V14C8.5 14.5523 8.05228 15 7.5 15H5C4.44772 15 4 14.5523 4 14V12ZM11.5 12C11.5 11.4477 11.9477 11 12.5 11H15C15.5523 11 16 11.4477 16 12V14C16 14.5523 15.5523 15 15 15H12.5C11.9477 15 11.5 14.5523 11.5 14V12Z" fill="white"/>
    </svg>
  )
}

// Icon/Pillar - Cyan (#008DAA) - Direct from Figma SVG export
export function IconPillar({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <rect width="20" height="20" rx="3" fill="#008DAA"/>
      <rect x="3.5" y="3.5" width="3" height="11" rx="0.5" fill="white"/>
      <rect x="8.5" y="3.5" width="3" height="11" rx="0.5" fill="white"/>
      <rect x="13.5" y="3.5" width="3" height="11" rx="0.5" fill="white"/>
      <rect x="3" y="15.5" width="14" height="1.5" rx="0.5" fill="white" opacity="0.7"/>
    </svg>
  )
}

// Icon/Sub-Pillar - Green (#00B69B) - Direct from Figma SVG export
export function IconSubPillar({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <rect width="20" height="20" rx="3" fill="#00B69B"/>
      <rect x="4.5" y="3.5" width="4" height="11" rx="0.5" fill="white"/>
      <rect x="11.5" y="3.5" width="4" height="11" rx="0.5" fill="white"/>
      <rect x="4" y="15.5" width="12" height="1.5" rx="0.5" fill="white" opacity="0.7"/>
    </svg>
  )
}

// Icon/Product - Pink (#D0419B) - Direct from Figma SVG export
export function IconProduct({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <rect width="20" height="20" rx="3" fill="#D0419B"/>
      <rect x="4.75" y="4.75" width="10.5" height="10.5" rx="0.75" stroke="white" strokeWidth="1.5" fill="none"/>
      <line x1="4.75" y1="8.25" x2="15.25" y2="8.25" stroke="white" strokeWidth="1.5"/>
      <circle cx="6.5" cy="6.5" r="0.75" fill="white"/>
    </svg>
  )
}

// Icon/App - Gray (#9E9FA3) - Direct from Figma SVG export
export function IconApp({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <rect width="20" height="20" rx="3" fill="#9E9FA3"/>
      <circle cx="10" cy="10" r="4.5" fill="white"/>
      <circle cx="10" cy="10" r="2" fill="#9E9FA3"/>
    </svg>
  )
}

// Chevron Down - from Living Design
export function ChevronDown({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Chevron Up - from Living Design
export function ChevronUp({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M12 10l-4-4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Magic Icon - AI/Sparkle
export function MagicIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1l1.5 4.5H14l-3.5 3 1.5 4.5L8 10l-4 3 1.5-4.5L2 5.5h4.5L8 1z" fill="#7B61FF"/>
    </svg>
  )
}

// Trophy Icon
export function TrophyIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M5 2h6v5a3 3 0 01-6 0V2z" stroke="#F59E0B" strokeWidth="1.2" fill="none"/>
      <path d="M3 3h2v2H3a1 1 0 01-1-1v0a1 1 0 011-1z" stroke="#F59E0B" strokeWidth="1.2" fill="none"/>
      <path d="M11 3h2a1 1 0 011 1v0a1 1 0 01-1 1h-2V3z" stroke="#F59E0B" strokeWidth="1.2" fill="none"/>
      <path d="M6 10v2h4v-2M5 14h6" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// Exclamation Circle
export function ExclamationCircleIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6.5" stroke="#EF4444" strokeWidth="1.2"/>
      <path d="M8 5v3.5M8 11v.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// List Box Icon
export function ListBoxIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M5 4h9M5 8h9M5 12h7M2 4h.5M2 8h.5M2 12h.5" stroke="#0071DC" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// Check Circle Fill
export function CheckCircleFillIcon({ className, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="7" cy="7" r="7" fill="#22C55E"/>
      <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
