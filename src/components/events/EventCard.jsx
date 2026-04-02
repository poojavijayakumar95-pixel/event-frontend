import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react'
import { formatDateTime, CATEGORY_META, isEventPast } from '../../lib/utils'
import { Badge } from '../ui'

export default function EventCard({ event, index = 0 }) {
  const past = isEventPast(event.startDateTime)
  const full = event.availableSlots <= 0
  const catMeta = CATEGORY_META[event.category] || CATEGORY_META.OTHER
  const occupancy = event.maxCapacity > 0
    ? Math.round((event.registeredCount / event.maxCapacity) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link to={`/events/${event.id}`} className="block h-full">
        <div className="card-luxury h-full flex flex-col overflow-hidden group">

          {/* Image / Visual header */}
          <div className="relative h-44 overflow-hidden bg-obsidian-900 flex-shrink-0">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Decorative geometric background */}
                <div className="absolute inset-0 bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900" />
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold-500/05 -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gold-500/03 translate-y-6 -translate-x-6" />
                <div className="relative text-obsidian-700 font-display text-6xl font-300 select-none">
                  {event.title[0]}
                </div>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              <Badge variant={catMeta.color.replace('badge-', '')}>
                {catMeta.label}
              </Badge>
              {past && <Badge variant="obsidian">Past</Badge>}
              {!past && full && <Badge variant="danger">Full</Badge>}
            </div>

            {/* Arrow */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-obsidian-950/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-gold">
              <ArrowUpRight className="w-4 h-4 text-gold-400" />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-5">
            <h3 className="font-display text-lg font-500 text-obsidian-100 leading-snug mb-3 line-clamp-2 group-hover:text-gold-300 transition-colors duration-300">
              {event.title}
            </h3>

            <div className="space-y-2 mb-4">
              <MetaRow icon={<Calendar className="w-3.5 h-3.5" />} text={formatDateTime(event.startDateTime)} />
              <MetaRow icon={<MapPin className="w-3.5 h-3.5" />} text={`${event.location}${event.venue ? ` · ${event.venue}` : ''}`} />
              <MetaRow
                icon={<Users className="w-3.5 h-3.5" />}
                text={past
                  ? `${event.registeredCount} attended`
                  : full
                    ? 'Fully booked'
                    : `${event.availableSlots} of ${event.maxCapacity} spots left`}
              />
            </div>

            {/* Occupancy bar */}
            {!past && (
              <div className="mb-4">
                <div className="h-0.5 w-full bg-obsidian-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: occupancy > 85
                        ? 'linear-gradient(90deg, #ef4444, #f87171)'
                        : 'linear-gradient(90deg, #e8a800, #f5c832)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancy}%` }}
                    transition={{ delay: index * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers?.length > 0 && (
              <div className="mt-auto pt-4 border-t border-gold-500/08">
                <p className="text-[10px] font-body font-600 tracking-widest uppercase text-obsidian-600 mb-2">
                  Speakers
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {event.speakers.slice(0, 3).map(s => (
                    <div
                      key={s.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-obsidian-900/80 border border-obsidian-800"
                    >
                      <div className="w-4 h-4 rounded-full bg-gold-gradient flex items-center justify-center text-[8px] font-display font-600 text-obsidian-950 flex-shrink-0">
                        {s.firstName?.[0]}
                      </div>
                      <span className="text-[11px] font-body text-obsidian-400">
                        {s.firstName} {s.lastName}
                      </span>
                    </div>
                  ))}
                  {event.speakers.length > 3 && (
                    <span className="text-[11px] font-body text-obsidian-600">
                      +{event.speakers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function MetaRow({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-obsidian-500">
      <span className="flex-shrink-0 text-gold-600/60">{icon}</span>
      <span className="text-xs font-body truncate">{text}</span>
    </div>
  )
}
