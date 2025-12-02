import { Music2, Disc3, Users, Clock, Shield, Hash, Play, MoreVertical } from "lucide-react"

interface CardTrilhaProps {
  nome: string
  album: string
  banda: string
  timestamp: string
  politica: string
  gMusicID: string
  isSelected?: boolean
  onSelect?: () => void
}

export default function CardTrilha({
  nome,
  album,
  banda,
  timestamp,
  politica,
  gMusicID,
  isSelected = false,
  onSelect
}: CardTrilhaProps) {
  // Determine policy status color
  const getPolicyColor = (policy: string) => {
    if (policy.toLowerCase().includes('livre')) return 'var(--gb-success)'
    if (policy.toLowerCase().includes('restrita')) return 'var(--gb-error)'
    return 'var(--gb-warning)'
  }

  const policyColor = getPolicyColor(politica)

  return (
    <div 
      className={`group relative card-glass p-5 transition-all duration-300 hover:border-[var(--gb-border-accent)] ${
        isSelected ? 'ring-2 ring-[var(--gb-accent)] border-[var(--gb-accent)]' : ''
      }`}
      onClick={onSelect}
    >
      {/* Top Row - Title and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--gb-accent)]/20 to-[var(--gb-accent)]/5 flex items-center justify-center">
            <Music2 className="w-6 h-6 text-[var(--gb-accent)]" />
          </div>
          <div>
            <h3 className="text-[var(--gb-text-primary)] font-semibold text-lg">{nome}</h3>
            <p className="text-[var(--gb-text-secondary)] text-sm">{banda}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-[var(--gb-surface)] hover:bg-[var(--gb-primary)] flex items-center justify-center text-[var(--gb-text-muted)] hover:text-white transition-all opacity-0 group-hover:opacity-100">
            <Play className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-[var(--gb-surface)] flex items-center justify-center text-[var(--gb-text-muted)] hover:text-[var(--gb-text-primary)] transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Disc3 className="w-4 h-4 text-[var(--gb-text-muted)]" />
          <span className="text-[var(--gb-text-secondary)]">{album}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-[var(--gb-text-muted)]" />
          <span className="text-[var(--gb-text-secondary)]">{timestamp}</span>
        </div>
      </div>

      {/* Bottom Row - Policy and ID */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--gb-border)]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: policyColor }} />
          <span className="text-xs font-medium" style={{ color: policyColor }}>
            {politica.replace(/[()]/g, '')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--gb-text-muted)]">
          <Hash className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">{gMusicID}</span>
        </div>
      </div>
    </div>
  )
}