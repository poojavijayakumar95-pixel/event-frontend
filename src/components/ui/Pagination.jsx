import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const delta = 2
    const left = Math.max(0, page - delta)
    const right = Math.min(totalPages - 1, page + delta)
    for (let i = left; i <= right; i++) pages.push(i)
    if (left > 0) { if (left > 1) pages.unshift('...'); pages.unshift(0) }
    if (right < totalPages - 1) { if (right < totalPages - 2) pages.push('...'); pages.push(totalPages - 1) }
    return pages
  }

  return (
    <motion.div
      className="flex items-center justify-center gap-1.5 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="w-9 h-9 rounded-xl border border-obsidian-700/60 flex items-center justify-center text-obsidian-400 hover:border-gold-500/30 hover:text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((p, i) => (
        p === '...'
          ? <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-obsidian-600 text-sm font-body">…</span>
          : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-9 h-9 rounded-xl text-sm font-body font-500 transition-all duration-200',
                p === page
                  ? 'bg-gold-gradient text-obsidian-950 shadow-gold font-600'
                  : 'border border-obsidian-700/60 text-obsidian-400 hover:border-gold-500/30 hover:text-gold-400'
              )}
            >
              {p + 1}
            </button>
          )
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="w-9 h-9 rounded-xl border border-obsidian-700/60 flex items-center justify-center text-obsidian-400 hover:border-gold-500/30 hover:text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
