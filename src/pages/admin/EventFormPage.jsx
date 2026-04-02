import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { eventsApi, queryKeys } from '../../api'
import EventForm from '../../components/events/EventForm'
import { PageLoader, Button } from '../../components/ui'
import { toast } from 'sonner'
import { getErrorMessage } from '../../lib/utils'

export default function EventFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: event, isLoading } = useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => eventsApi.getById(id).then(r => r.data),
    enabled: isEdit,
    staleTime: 60_000,
  })

  const createMutation = useMutation({
    mutationFn: (data) => eventsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all() })
      toast.success('Event created successfully!')
      navigate(`/events/${res.data.id}`)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => eventsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all() })
      toast.success('Event updated successfully!')
      navigate(`/events/${id}`)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      speakerIds: (data.speakerIds ?? []).map(Number).filter(Boolean),
      imageUrl: data.imageUrl || null,
      venue:    data.venue    || null,
    }
    isEdit ? updateMutation.mutate(payload) : createMutation.mutate(payload)
  }

  const loading = createMutation.isPending || updateMutation.isPending

  if (isEdit && isLoading) return <PageLoader />

  return (
    <div className="py-10 pb-20">
      <div className="page-container max-w-2xl">

        <Link to="/admin">
          <motion.button
            className="flex items-center gap-2 text-sm font-body text-obsidian-500 hover:text-gold-400 mb-8 transition-colors"
            whileHover={{ x: -3 }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold flex-shrink-0">
              <Sparkles className="w-5 h-5 text-obsidian-950" />
            </div>
            <div>
              <p className="text-xs font-body font-600 tracking-widest uppercase text-gold-600">
                {isEdit ? 'Edit' : 'Create'}
              </p>
              <h1 className="font-display text-2xl font-400 text-obsidian-100">
                {isEdit ? 'Edit Event' : 'New Event'}
              </h1>
            </div>
          </div>

          {/* Form card */}
          <div className="card-luxury p-8">
            <EventForm
              defaultValues={isEdit ? event : undefined}
              onSubmit={handleSubmit}
              loading={loading}
              isEdit={isEdit}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
