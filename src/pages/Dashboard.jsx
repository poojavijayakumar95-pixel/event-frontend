import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, XCircle, Clock, LayoutDashboard, ArrowUpRight } from 'lucide-react'
import { registrationsApi, queryKeys } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDateTime, REG_STATUS_META, cn } from '../lib/utils'
import { Button, Badge, PageLoader, EmptyState, Skeleton, StatCard } from '../components/ui'
import Pagination from '../components/ui/Pagination'
import { toast } from 'sonner'

export default function Dashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.registrations.my(page),
    queryFn: () => registrationsApi.myRegistrations(page, 8).then(r => r.data),
    staleTime: 30_000,
  })

  const cancelMutation = useMutation({
    mutationFn: (eventId) => registrationsApi.cancel(eventId),
    onSuccess: () => {
      toast.success('Registration cancelled.')
      queryClient.invalidateQueries({ queryKey: ['registrations'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to cancel'),
  })

  const stats = data ? {
    total:     data.totalElements,
    upcoming:  data.content.filter(r => r.status === 'REGISTERED').length,
    attended:  data.content.filter(r => r.status === 'ATTENDED').length,
    cancelled: data.content.filter(r => r.status === 'CANCELLED').length,
  } : null

  return (
    <div className="py-10 pb-20">
      <div className="page-container">

        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <LayoutDashboard className="w-5 h-5 text-obsidian-950" />
            </div>
            <div>
              <p className="text-xs font-body font-600 tracking-widest uppercase text-gold-600">Personal</p>
              <h1 className="font-display text-3xl font-400 text-obsidian-100">My Dashboard</h1>
            </div>
          </div>
          <p className="text-sm font-body text-obsidian-500 mt-2">
            Welcome back, <span className="text-obsidian-300">{user?.firstName}</span>
          </p>
        </motion.div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : stats && (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard label="Total Registrations" value={stats.total} icon={Calendar} color="gold" />
            <StatCard label="Upcoming" value={stats.upcoming} icon={Clock} color="blue" />
            <StatCard label="Attended" value={stats.attended} icon={CheckCircle2} color="green" />
            <StatCard label="Cancelled" value={stats.cancelled} icon={XCircle} color="purple" />
          </motion.div>
        )}

        {/* Registrations table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-500 text-obsidian-200">My Registrations</h2>
            <Link to="/events">
              <Button variant="ghost" size="sm" className="gap-1.5">
                Browse Events <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="card-luxury overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-gold-500/05 last:border-0">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
              ))}
            </div>
          ) : data?.content?.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No registrations yet"
              description="Browse upcoming events and register to get started."
              action={<Link to="/events"><Button>Browse Events</Button></Link>}
            />
          ) : (
            <div className="card-luxury overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-gold-500/08">
                {['Event', 'Date', 'Location', 'Status', 'Action'].map(h => (
                  <div key={h} className={cn(
                    'text-[10px] font-body font-600 tracking-widest uppercase text-obsidian-600',
                    h === 'Event' && 'col-span-4',
                    h === 'Date' && 'col-span-3',
                    h === 'Location' && 'col-span-2',
                    h === 'Status' && 'col-span-2',
                    h === 'Action' && 'col-span-1',
                  )}>
                    {h}
                  </div>
                ))}
              </div>

              {data.content.map((reg, i) => {
                const statusMeta = REG_STATUS_META[reg.status]
                return (
                  <motion.div
                    key={reg.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 border-b border-gold-500/05 last:border-0 hover:bg-gold-500/02 transition-colors"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="sm:col-span-4">
                      <Link to={`/events/${reg.eventId}`} className="font-body font-600 text-sm text-obsidian-100 hover:text-gold-400 transition-colors line-clamp-1">
                        {reg.eventTitle}
                      </Link>
                    </div>
                    <div className="sm:col-span-3 text-xs font-body text-obsidian-500">
                      {formatDateTime(reg.eventStartDateTime)}
                    </div>
                    <div className="sm:col-span-2 text-xs font-body text-obsidian-500 truncate">
                      {reg.eventLocation}
                    </div>
                    <div className="sm:col-span-2">
                      <Badge variant={statusMeta?.color?.replace('badge-', '') || 'obsidian'}>
                        {statusMeta?.label || reg.status}
                      </Badge>
                    </div>
                    <div className="sm:col-span-1">
                      {reg.status === 'REGISTERED' && (
                        <Button
                          variant="danger"
                          size="sm"
                          loading={cancelMutation.isPending && cancelMutation.variables === reg.eventId}
                          onClick={() => cancelMutation.mutate(reg.eventId)}
                          className="text-xs px-2.5 py-1"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
              <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
