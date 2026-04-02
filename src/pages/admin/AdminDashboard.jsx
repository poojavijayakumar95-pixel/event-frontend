import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2, Users, Calendar, Plus, Pencil, Trash2,
  ToggleLeft, ToggleRight, Shield, CheckCircle2, XCircle,
  AlertCircle, TrendingUp, ArrowUpRight
} from 'lucide-react'
import { adminApi, eventsApi, queryKeys } from '../../api'
import { formatDateTime, CATEGORY_META, REG_STATUS_META, cn } from '../../lib/utils'
import { Button, Badge, PageLoader, StatCard, Skeleton, EmptyState } from '../../components/ui'
import Pagination from '../../components/ui/Pagination'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'events',   label: 'Events',   icon: Calendar },
  { id: 'users',    label: 'Users',    icon: Users },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [evtPage, setEvtPage] = useState(0)
  const queryClient = useQueryClient()

  const statsQuery = useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => adminApi.dashboard().then(r => r.data),
    staleTime: 60_000,
  })

  const usersQuery = useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: () => adminApi.getUsers().then(r => r.data),
    enabled: tab === 'users',
    staleTime: 60_000,
  })

  const eventsQuery = useQuery({
    queryKey: queryKeys.events.list({ page: evtPage }),
    queryFn: () => eventsApi.getAll(evtPage, 10).then(r => r.data),
    enabled: tab === 'events',
    staleTime: 30_000,
  })

  const toggleUserMutation = useMutation({
    mutationFn: (userId) => adminApi.toggleUserStatus(userId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() }); toast.success('User status updated') },
    onError: () => toast.error('Failed to update user'),
  })

  const promoteUserMutation = useMutation({
    mutationFn: (userId) => adminApi.promoteUser(userId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() }); toast.success('User promoted to Admin') },
    onError: () => toast.error('Failed to promote user'),
  })

  const deleteEventMutation = useMutation({
    mutationFn: (id) => eventsApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }); toast.success('Event deleted') },
    onError: () => toast.error('Failed to delete event'),
  })

  const stats = statsQuery.data

  // Chart data
  const chartData = stats ? [
    { name: 'Events',        value: stats.totalEvents,        color: '#e8a800' },
    { name: 'Users',         value: stats.totalUsers,         color: '#60a5fa' },
    { name: 'Registrations', value: stats.totalRegistrations, color: '#4ade80' },
    { name: 'Upcoming',      value: stats.upcomingEvents,     color: '#c084fc' },
  ] : []

  return (
    <div className="py-10 pb-20">
      <div className="page-container">

        {/* Header */}
        <motion.div className="flex items-center justify-between mb-10 flex-wrap gap-4"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="text-xs font-body font-600 tracking-widest uppercase text-gold-600 mb-1">Management</p>
            <h1 className="font-display text-3xl font-400 text-obsidian-100">Admin Panel</h1>
          </div>
          <Link to="/admin/events/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Event
            </Button>
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gold-500/08 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 text-sm font-body font-500 border-b-2 transition-all duration-200 whitespace-nowrap -mb-px',
                tab === t.id
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-obsidian-500 hover:text-obsidian-200'
              )}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Overview tab ── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {statsQuery.isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
                </div>
              ) : stats && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Events"      value={stats.totalEvents}        icon={Calendar}  color="gold"   />
                    <StatCard label="Total Users"       value={stats.totalUsers}         icon={Users}     color="blue"   />
                    <StatCard label="Registrations"     value={stats.totalRegistrations} icon={TrendingUp} color="green"  />
                    <StatCard label="Upcoming Events"   value={stats.upcomingEvents}     icon={ArrowUpRight} color="purple" />
                  </div>

                  {/* Bar chart */}
                  <div className="card-luxury p-6">
                    <h3 className="font-display text-lg font-500 text-obsidian-200 mb-6">Platform Overview</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={chartData} barSize={40}>
                        <XAxis dataKey="name" tick={{ fill: '#6b6b55', fontSize: 11, fontFamily: 'Cabinet Grotesk' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6b6b55', fontSize: 11, fontFamily: 'Cabinet Grotesk' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: 'rgba(232,168,0,0.04)' }}
                          contentStyle={{
                            background: '#111109', border: '1px solid rgba(232,168,0,0.15)',
                            borderRadius: 12, fontFamily: 'Cabinet Grotesk', fontSize: 12, color: '#e8e8d8',
                          }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} opacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── Events tab ── */}
          {tab === 'events' && (
            <motion.div key="events" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {eventsQuery.isLoading ? (
                <div className="card-luxury overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-gold-500/05 last:border-0">
                      <Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/4" /><Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : eventsQuery.data?.content?.length === 0 ? (
                <EmptyState icon={Calendar} title="No events yet" description="Create your first event to get started."
                  action={<Link to="/admin/events/new"><Button>Create Event</Button></Link>} />
              ) : (
                <div className="card-luxury overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gold-500/08">
                    {['Title','Date','Category','Registered','Capacity','Actions'].map((h, i) => (
                      <div key={h} className={cn('text-[10px] font-body font-600 tracking-widest uppercase text-obsidian-600',
                        i === 0 ? 'col-span-4' : i === 1 ? 'col-span-3' : i === 5 ? 'col-span-1' : 'col-span-1')}>{h}</div>
                    ))}
                  </div>
                  {eventsQuery.data.content.map((e, i) => {
                    const catMeta = CATEGORY_META[e.category] || CATEGORY_META.OTHER
                    return (
                      <motion.div key={e.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 px-5 py-3.5 border-b border-gold-500/05 last:border-0 hover:bg-gold-500/02 transition-colors"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                        <div className="sm:col-span-4">
                          <Link to={`/events/${e.id}`} className="font-body font-600 text-sm text-obsidian-100 hover:text-gold-400 transition-colors line-clamp-1">{e.title}</Link>
                        </div>
                        <div className="sm:col-span-3 text-xs font-body text-obsidian-500">{formatDateTime(e.startDateTime)}</div>
                        <div className="sm:col-span-1"><Badge variant={catMeta.color.replace('badge-', '')}>{catMeta.label}</Badge></div>
                        <div className="sm:col-span-1 text-xs font-body text-obsidian-400">{e.registeredCount}</div>
                        <div className="sm:col-span-2 text-xs font-body text-obsidian-400">{e.maxCapacity}</div>
                        <div className="sm:col-span-1 flex gap-1.5">
                          <Link to={`/admin/events/${e.id}/edit`}>
                            <button className="p-1.5 rounded-lg text-obsidian-500 hover:text-gold-400 hover:bg-gold-500/08 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => { if (confirm('Delete this event?')) deleteEventMutation.mutate(e.id) }}
                            className="p-1.5 rounded-lg text-obsidian-500 hover:text-red-400 hover:bg-red-500/08 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                  <Pagination page={evtPage} totalPages={eventsQuery.data.totalPages} onPageChange={setEvtPage} />
                </div>
              )}
            </motion.div>
          )}

          {/* ── Users tab ── */}
          {tab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {usersQuery.isLoading ? (
                <div className="card-luxury overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-gold-500/05 last:border-0">
                      <Skeleton className="h-8 w-8 rounded-xl" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-luxury overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gold-500/08">
                    {['User','Email','Role','Status','Actions'].map((h, i) => (
                      <div key={h} className={cn('text-[10px] font-body font-600 tracking-widest uppercase text-obsidian-600',
                        h === 'User' ? 'col-span-3' : h === 'Email' ? 'col-span-4' : h === 'Actions' ? 'col-span-2' : 'col-span-1')}>{h}</div>
                    ))}
                  </div>
                  {usersQuery.data?.map((u, i) => (
                    <motion.div key={u.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 px-5 py-3.5 border-b border-gold-500/05 last:border-0 hover:bg-gold-500/02 transition-colors items-center"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <div className="sm:col-span-3 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gold-gradient flex items-center justify-center text-obsidian-950 text-xs font-display font-600 flex-shrink-0">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                        <span className="font-body font-600 text-sm text-obsidian-100">{u.firstName} {u.lastName}</span>
                      </div>
                      <div className="sm:col-span-4 text-xs font-body text-obsidian-500 truncate">{u.email}</div>
                      <div className="sm:col-span-1">
                        <Badge variant={u.role === 'ROLE_ADMIN' ? 'gold' : 'obsidian'}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </Badge>
                      </div>
                      <div className="sm:col-span-1">
                        <Badge variant={u.enabled ? 'success' : 'danger'}>
                          {u.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="sm:col-span-2 flex gap-1.5">
                        <button
                          onClick={() => toggleUserMutation.mutate(u.id)}
                          title={u.enabled ? 'Disable user' : 'Enable user'}
                          className="p-1.5 rounded-lg text-obsidian-500 hover:text-gold-400 hover:bg-gold-500/08 transition-colors">
                          {u.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        {u.role !== 'ROLE_ADMIN' && (
                          <button
                            onClick={() => { if (confirm('Promote this user to Admin?')) promoteUserMutation.mutate(u.id) }}
                            title="Promote to Admin"
                            className="p-1.5 rounded-lg text-obsidian-500 hover:text-gold-400 hover:bg-gold-500/08 transition-colors">
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
