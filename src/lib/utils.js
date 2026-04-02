import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dt) => {
  if (!dt) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(dt))
}

export const formatDateTime = (dt) => {
  if (!dt) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(dt))
}

export const formatRelative = (dt) => {
  if (!dt) return '—'
  const now = new Date()
  const then = new Date(dt)
  const diffMs = then - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'Past event'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`
  return formatDate(dt)
}

export const isEventPast = (dt) => dt && new Date(dt) < new Date()

export const CATEGORIES = [
  'CONFERENCE','WORKSHOP','SEMINAR','WEBINAR',
  'NETWORKING','CONCERT','SPORTS','EXHIBITION','OTHER',
]

export const CATEGORY_META = {
  CONFERENCE:  { label: 'Conference',  color: 'badge-gold' },
  WORKSHOP:    { label: 'Workshop',    color: 'badge-success' },
  SEMINAR:     { label: 'Seminar',     color: 'badge-gold' },
  WEBINAR:     { label: 'Webinar',     color: 'badge-obsidian' },
  NETWORKING:  { label: 'Networking',  color: 'badge-obsidian' },
  CONCERT:     { label: 'Concert',     color: 'badge-danger' },
  SPORTS:      { label: 'Sports',      color: 'badge-success' },
  EXHIBITION:  { label: 'Exhibition',  color: 'badge-gold' },
  OTHER:       { label: 'Other',       color: 'badge-obsidian' },
}

export const REG_STATUS_META = {
  REGISTERED: { label: 'Registered', color: 'badge-gold' },
  ATTENDED:   { label: 'Attended',   color: 'badge-success' },
  CANCELLED:  { label: 'Cancelled',  color: 'badge-danger' },
  NO_SHOW:    { label: 'No Show',    color: 'badge-obsidian' },
}

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong'
