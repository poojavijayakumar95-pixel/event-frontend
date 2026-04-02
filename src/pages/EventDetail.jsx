import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Users, ArrowLeft, Linkedin,
  Globe, Pencil, Trash2, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react'
import { eventsApi, registrationsApi, queryKeys } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDateTime, CATEGORY_META, isEventPast, REG_STATUS_META, cn } from '../lib/utils'
import { Button, Badge, PageLoader, Skeleton, StatCard } from '../components/ui'
import { toast } from 'sonner'

export default function EventDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: event, isLoading, isError } = useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => eventsApi.getById(id).then(r => r.data),
    staleTime: 60_000,
  })

  const { data: myRegs } = useQuery({
    queryKey: queryKeys.registrations.my(0),
    queryFn: () => registrationsApi.myRegistrations(0, 100).then(r => r.data),
    enabled: !!user,
  })

  const myReg = myRegs?.content?.find(r => r.eventId === Number(id))
  const isRegistered = myReg?.status === 'REGISTERED'

  const registerMutation = useMutation({
    mutationFn: () => registrationsApi.register(Number(id)),
    onSuccess: () => {
      toast.success('Registered! Check your email for confirmation.')
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.registrations.my(0) })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Registration failed'),
  })

  const cancelMutation = useMutation({
    mutationFn: () => registrationsApi.cancel(Number(id)),
    onSuccess: () => {
      toast.success('Registration cancelled.')
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.registrations.my(0) })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Cancellation failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => eventsApi.delete(id),
    onSuccess: () => {
      toast.success('Event deleted.')
      navigate('/events')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  })

  if (isLoading) return <PageLoader />
  if (isError || !event) return (
    <div className="page-container py-20 text-center">
      <p className="text-obsidian-400 font-body">Event not found.</p>
      <Link to="/events"><Button variant="ghost" className="mt-4">Back to Events</Button></Link>
    </div>
  )

  const past = isEventPast(event.startDateTime)
  const full = event.availableSlots <= 0
  const catMeta = CATEGORY_META[event.category] || CATEGORY_META.OTHER
  const occupancyPct = event.maxCapacity > 0
    ? Math.round((event.registeredCount / event.maxCapacity) * 100) : 0

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900 flex items-center justify-center">
            <span className="font-display text-9xl font-300 text-obsidian-800 select-none">{event.title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-transparent" />

        {/* Back button */}
        <Link to="/events" className="absolute top-4 left-4 sm:left-8">
          <motion.button
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-obsidian-950/70 backdrop-blur-sm border border-obsidian-700/60 text-obsidian-300 hover:text-gold-400 hover:border-gold-500/30 text-sm font-body transition-all"
            whileHover={{ x: -2 }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </motion.button>
        </Link>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8">
          <div className="page-container px-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant={catMeta.color.replace('badge-', '')}>{catMeta.label}</Badge>
              {past && <Badge variant="obsidian">Past Event</Badge>}
              {!past && full && <Badge variant="danger">Fully Booked</Badge>}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-400 text-white text-balance leading-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Meta strip */}
            <motion.div
              className="card-luxury p-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MetaItem icon={<Calendar className="w-4 h-4" />} label="Date & Time" value={formatDateTime(event.startDateTime)} />
              <MetaItem icon={<MapPin className="w-4 h-4" />} label="Location" value={`${event.location}${event.venue ? ` · ${event.venue}` : ''}`} />
              <MetaItem icon={<Users className="w-4 h-4" />} label="Attendance"
                value={past ? `${event.registeredCount} attended` : `${event.registeredCount} / ${event.maxCapacity}`} />
            </motion.div>

            {/* Occupancy bar */}
            {!past && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-body text-obsidian-500">
                  <span>{event.availableSlots} spots remaining</span>
                  <span>{occupancyPct}% full</span>
                </div>
                <div className="h-1.5 bg-obsidian-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: occupancyPct > 85 ? 'linear-gradient(90deg,#ef4444,#f87171)' : 'linear-gradient(90deg,#e8a800,#f5c832)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancyPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <h2 className="font-display text-xl font-500 text-obsidian-200 mb-4 line-gold">About this Event</h2>
                <p className="text-sm font-body text-obsidian-400 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </motion.div>
            )}

            {/* Speakers */}
            {event.speakers?.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <h2 className="font-display text-xl font-500 text-obsidian-200 mb-4 line-gold">Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((s, i) => (
                    <motion.div
                      key={s.id}
                      className="card-luxury p-4 flex gap-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="flex-shrink-0">
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt={s.firstName} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center text-obsidian-950 font-display text-lg font-600">
                            {s.firstName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-600 text-sm text-obsidian-100">{s.firstName} {s.lastName}</p>
                        {s.title && <p className="text-xs font-body text-obsidian-500 mt-0.5">{s.title}</p>}
                        {s.organization && <p className="text-xs font-body text-gold-600 mt-0.5">{s.organization}</p>}
                        {s.bio && <p className="text-xs font-body text-obsidian-600 mt-2 line-clamp-2 leading-relaxed">{s.bio}</p>}
                        <div className="flex gap-2 mt-2">
                          {s.linkedinUrl && (
                            <a href={s.linkedinUrl} target="_blank" rel="noreferrer" className="text-obsidian-600 hover:text-gold-400 transition-colors">
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {s.websiteUrl && (
                            <a href={s.websiteUrl} target="_blank" rel="noreferrer" className="text-obsidian-600 hover:text-gold-400 transition-colors">
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            <motion.div
              className="card-luxury p-6 sticky top-20"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              {past ? (
                <div className="text-center py-4">
                  <p className="text-obsidian-400 font-body text-sm">This event has ended.</p>
                  <p className="text-obsidian-600 font-body text-xs mt-1">{event.registeredCount} people attended</p>
                </div>
              ) : (
                <>
                  {isRegistered ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-green-500/08 border border-green-500/20">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-body font-600 text-green-400">You're registered!</p>
                          <p className="text-xs font-body text-obsidian-500 mt-0.5">Confirmation sent to your email</p>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        className="w-full"
                        loading={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate()}
                      >
                        <XCircle className="w-4 h-4" /> Cancel Registration
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={full}
                      loading={registerMutation.isPending}
                      onClick={() => user ? registerMutation.mutate() : navigate('/login')}
                    >
                      {full ? 'Fully Booked' : user ? 'Register Now' : 'Sign In to Register'}
                    </Button>
                  )}

                  <p className="text-center text-xs font-body text-obsidian-600 mt-3">
                    {full ? 'No spots remaining' : `${event.availableSlots} spot${event.availableSlots !== 1 ? 's' : ''} remaining`}
                  </p>
                </>
              )}

              {/* Admin actions */}
              {isAdmin && (
                <div className="mt-5 pt-5 border-t border-gold-500/08 space-y-2">
                  <p className="text-[10px] font-body font-600 tracking-widest uppercase text-obsidian-600 mb-3">Admin Actions</p>
                  <Link to={`/admin/events/${id}/edit`}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Pencil className="w-4 h-4" /> Edit Event
                    </Button>
                  </Link>
                  {!confirmDelete ? (
                    <Button variant="danger" className="w-full justify-start gap-2" onClick={() => setConfirmDelete(true)}>
                      <Trash2 className="w-4 h-4" /> Delete Event
                    </Button>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-500/08 border border-red-500/20 space-y-2">
                      <p className="text-xs font-body text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Are you sure?
                      </p>
                      <div className="flex gap-2">
                        <Button variant="danger" size="sm" loading={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate()} className="flex-1">
                          Confirm
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      <span className="text-gold-500 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-body font-600 tracking-widest uppercase text-obsidian-600 mb-0.5">{label}</p>
        <p className="text-sm font-body text-obsidian-200">{value}</p>
      </div>
    </div>
  )
}
