import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { createEventSchema, updateEventSchema } from '../../lib/schemas'
import { speakersApi, queryKeys } from '../../api'
import { Input, Textarea, Select, Button } from '../ui'
import { CATEGORIES } from '../../lib/utils'
import { Check, User } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

export default function EventForm({ defaultValues, onSubmit, loading, isEdit = false }) {
  const schema = isEdit ? updateEventSchema : createEventSchema

  const { data: speakersData } = useQuery({
    queryKey: queryKeys.speakers.list(''),
    queryFn: () => speakersApi.getAll().then(r => r.data),
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      startDateTime: defaultValues.startDateTime?.slice(0, 16) ?? '',
      endDateTime:   defaultValues.endDateTime?.slice(0, 16)   ?? '',
      speakerIds:    defaultValues.speakers?.map(s => s.id)    ?? [],
      imageUrl:      defaultValues.imageUrl ?? '',
      venue:         defaultValues.venue    ?? '',
      description:   defaultValues.description ?? '',
    } : {
      title: '', description: '', startDateTime: '', endDateTime: '',
      location: '', venue: '', category: '', maxCapacity: 100,
      imageUrl: '', speakerIds: [],
    },
  })

  const selectedSpeakerIds = watch('speakerIds') ?? []

  const fieldClass = (name) => errors[name] ? 'error' : ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
          Event Title *
        </label>
        <input
          {...register('title')}
          placeholder="e.g. React Summit 2025"
          className={cn('input-luxury font-body w-full', errors.title && 'border-red-500/40')}
        />
        {errors.title && <p className="text-xs text-red-400 font-body mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe your event…"
          className="input-luxury font-body w-full resize-none"
        />
        {errors.description && <p className="text-xs text-red-400 font-body mt-1">{errors.description.message}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            {...register('startDateTime')}
            className={cn('input-luxury font-body w-full', errors.startDateTime && 'border-red-500/40')}
            style={{ colorScheme: 'dark' }}
          />
          {errors.startDateTime && <p className="text-xs text-red-400 font-body mt-1">{errors.startDateTime.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            {...register('endDateTime')}
            className={cn('input-luxury font-body w-full', errors.endDateTime && 'border-red-500/40')}
            style={{ colorScheme: 'dark' }}
          />
          {errors.endDateTime && <p className="text-xs text-red-400 font-body mt-1">{errors.endDateTime.message}</p>}
        </div>
      </div>

      {/* Location / Venue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
            Location *
          </label>
          <input
            {...register('location')}
            placeholder="City, Country"
            className={cn('input-luxury font-body w-full', errors.location && 'border-red-500/40')}
          />
          {errors.location && <p className="text-xs text-red-400 font-body mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
            Venue
          </label>
          <input
            {...register('venue')}
            placeholder="Convention Center, Hotel…"
            className="input-luxury font-body w-full"
          />
        </div>
      </div>

      {/* Category / Capacity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
            Category *
          </label>
          <select
            {...register('category')}
            className={cn('input-luxury font-body w-full cursor-pointer', errors.category && 'border-red-500/40')}
            style={{ colorScheme: 'dark' }}
          >
            <option value="">Select category…</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-400 font-body mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
            Max Capacity *
          </label>
          <input
            type="number"
            min={1}
            {...register('maxCapacity')}
            placeholder="200"
            className={cn('input-luxury font-body w-full', errors.maxCapacity && 'border-red-500/40')}
          />
          {errors.maxCapacity && <p className="text-xs text-red-400 font-body mt-1">{errors.maxCapacity.message}</p>}
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-1.5">
          Cover Image URL
        </label>
        <input
          {...register('imageUrl')}
          placeholder="https://…"
          className={cn('input-luxury font-body w-full', errors.imageUrl && 'border-red-500/40')}
        />
        {errors.imageUrl && <p className="text-xs text-red-400 font-body mt-1">{errors.imageUrl.message}</p>}
      </div>

      {/* Speaker multi-select */}
      {speakersData?.length > 0 && (
        <div>
          <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400 mb-2">
            Speakers
          </label>
          <Controller
            name="speakerIds"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {speakersData.map(s => {
                  const selected = field.value?.includes(s.id)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? field.value.filter(id => id !== s.id)
                          : [...(field.value ?? []), s.id]
                        field.onChange(next)
                      }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-body transition-all duration-200',
                        selected
                          ? 'border-gold-500/40 bg-gold-500/10 text-gold-400'
                          : 'border-obsidian-700/60 bg-obsidian-900/50 text-obsidian-400 hover:border-obsidian-600'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-display font-600 flex-shrink-0',
                        selected ? 'bg-gold-gradient text-obsidian-950' : 'bg-obsidian-700 text-obsidian-400'
                      )}>
                        {selected ? <Check className="w-2.5 h-2.5" /> : s.firstName?.[0]}
                      </div>
                      {s.firstName} {s.lastName}
                    </button>
                  )
                })}
              </div>
            )}
          />
        </div>
      )}

      <div className="divider-gold" />

      <Button type="submit" loading={loading} size="lg" className="w-full">
        {isEdit ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  )
}
