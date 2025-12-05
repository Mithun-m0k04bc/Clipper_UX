/* Living Design Tag Component */

interface TagProps {
  children: React.ReactNode
  variant?: 'blue' | 'purple' | 'green' | 'orange' | 'gray' | 'red'
  size?: 'sm' | 'md'
  onRemove?: () => void
}

const variantStyles = {
  blue: 'bg-[#E6F1FC] text-[#004F9A]',
  purple: 'bg-[#EFEBF2] text-[#73478B]',
  green: 'bg-[#EAF3E6] text-[#2A8703]',
  orange: 'bg-[#FFF0E6] text-[#FA6400]',
  gray: 'bg-[#F1F1F2] text-[#515357]',
  red: 'bg-[#FFEBEE] text-[#E53935]',
}

export default function Tag({ children, variant = 'blue', onRemove }: TagProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-sm font-['Bogle',sans-serif] text-xs leading-4 whitespace-nowrap ${variantStyles[variant]}`}>
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center justify-center w-3 h-3 hover:opacity-70 transition-opacity"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}

