import { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'

// ── Button ────────────────────────────────────────────────────
const buttonVariants = {
  gold:    'btn-gold px-5 py-2.5 rounded-xl text-sm font-body font-600',
  ghost:   'btn-ghost-gold px-5 py-2.5 rounded-xl text-sm font-body font-500',
  danger:  'px-5 py-2.5 rounded-xl text-sm font-body font-500 border border-red-500/20 bg-red-500/08 text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition-all duration-300',
  outline: 'px-5 py-2.5 rounded-xl text-sm font-body font-500 border border-obsidian-700/60 text-obsidian-300 hover:border-obsidian-600 hover:text-obsidian-100 transition-all duration-300',
  link:    'text-sm font-body text-gold-400 hover:text-gold-300 underline-offset-4 hover:underline transition-colors',
}

export const Button = forwardRef(({
  variant = 'gold', size, className, loading, disabled, children, ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      buttonVariants[variant],
      'inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      size === 'sm' && 'px-3.5 py-1.5 text-xs',
      size === 'lg' && 'px-7 py-3.5 text-base',
      className
    )}
    {...props}
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {children}
  </button>
))
Button.displayName = 'Button'

// ── Input ────────────────────────────────────────────────────
export const Input = forwardRef(({ className, error, label, hint, icon, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-500 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'input-luxury font-body',
          icon && 'pl-10',
          error && 'border-red-500/40 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.06)]',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400 font-body flex items-center gap-1.5">
      <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
      {error}
    </p>}
    {hint && !error && <p className="text-xs text-obsidian-500 font-body">{hint}</p>}
  </div>
))
Input.displayName = 'Input'

// ── Textarea ─────────────────────────────────────────────────
export const Textarea = forwardRef(({ className, error, label, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      className={cn(
        'input-luxury font-body resize-none min-h-[120px]',
        error && 'border-red-500/40',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-400 font-body">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

// ── Select ───────────────────────────────────────────────────
export const Select = forwardRef(({ className, error, label, children, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400">
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={cn(
        'input-luxury font-body cursor-pointer',
        error && 'border-red-500/40',
        className
      )}
      style={{ colorScheme: 'dark' }}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-400 font-body">{error}</p>}
  </div>
))
Select.displayName = 'Select'

// ── Badge ────────────────────────────────────────────────────
export function Badge({ variant = 'gold', className, children }) {
  return (
    <span className={cn(`badge-${variant}`, 'font-body', className)}>
      {children}
    </span>
  )
}

// ── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ className, children, hover = true, ...props }) {
  return (
    <div
      className={cn('card-luxury', hover && 'cursor-pointer', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ── Modal / Dialog ────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* Panel */}
          <motion.div
            className={cn(
              'relative w-full card-luxury p-6 shadow-2xl z-10',
              sizes[size]
            )}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-500 text-obsidian-100">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-obsidian-500 hover:text-obsidian-200 hover:bg-obsidian-800/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <Loader2 className={cn('animate-spin text-gold-500', sizes[size], className)} />
  )
}

// ── PageLoader ────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-obsidian-700 border-t-gold-500"
      />
      <p className="text-obsidian-500 text-sm font-body tracking-widest uppercase">Loading…</p>
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────
export function Divider({ className }) {
  return <div className={cn('divider-gold my-6', className)} />
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-obsidian-600" />
        </div>
      )}
      <h3 className="font-display text-xl text-obsidian-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-obsidian-500 font-body max-w-xs mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  )
}

// ── Stats Card ────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, trend, color = 'gold' }) {
  const colors = {
    gold:    { bg: 'bg-gold-500/8 border-gold-500/15',    icon: 'text-gold-500',    val: 'text-gold-400' },
    green:   { bg: 'bg-green-500/8 border-green-500/15',  icon: 'text-green-400',   val: 'text-green-400' },
    blue:    { bg: 'bg-blue-500/8 border-blue-500/15',    icon: 'text-blue-400',    val: 'text-blue-400' },
    purple:  { bg: 'bg-purple-500/8 border-purple-500/15',icon: 'text-purple-400',  val: 'text-purple-400' },
  }
  const c = colors[color] || colors.gold
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn('card-luxury p-5 border', c.bg)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl border', c.bg)}>
          <Icon className={cn('w-5 h-5', c.icon)} />
        </div>
        {trend !== undefined && (
          <span className={cn('text-xs font-body font-600',
            trend >= 0 ? 'text-green-400' : 'text-red-400')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className={cn('font-display text-3xl font-600 mb-1', c.val)}>{value}</p>
      <p className="text-xs font-body font-600 tracking-widest uppercase text-obsidian-500">{label}</p>
    </motion.div>
  )
}
