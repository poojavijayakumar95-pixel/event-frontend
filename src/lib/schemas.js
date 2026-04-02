import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(100),
  lastName:  z.string().min(2, 'Last name must be at least 2 characters').max(100),
  email:     z.string().email('Invalid email address'),
  password:  z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  phone: z.string().optional(),
})

export const createEventSchema = z.object({
  title:         z.string().min(3, 'Title must be at least 3 characters').max(200),
  description:   z.string().max(5000).optional(),
  startDateTime: z.string().min(1, 'Start date is required').refine(
    (val) => new Date(val) > new Date(), { message: 'Start date must be in the future' }
  ),
  endDateTime:   z.string().min(1, 'End date is required'),
  location:      z.string().min(2, 'Location is required').max(300),
  venue:         z.string().max(200).optional(),
  category:      z.string().min(1, 'Category is required'),
  maxCapacity:   z.coerce.number().min(1, 'Capacity must be at least 1').max(100000),
  imageUrl:      z.string().url('Must be a valid URL').optional().or(z.literal('')),
  speakerIds:    z.array(z.number()).optional().default([]),
}).refine(
  (data) => new Date(data.endDateTime) > new Date(data.startDateTime),
  { message: 'End date must be after start date', path: ['endDateTime'] }
)

export const updateEventSchema = z.object({
  title:         z.string().min(3, 'Title must be at least 3 characters').max(200),
  description:   z.string().max(5000).optional(),
  startDateTime: z.string().min(1, 'Start date is required'),
  endDateTime:   z.string().min(1, 'End date is required'),
  location:      z.string().min(2, 'Location is required').max(300),
  venue:         z.string().max(200).optional(),
  category:      z.string().min(1, 'Category is required'),
  maxCapacity:   z.coerce.number().min(1).max(100000),
  imageUrl:      z.string().url('Must be a valid URL').optional().or(z.literal('')),
  speakerIds:    z.array(z.number()).optional().default([]),
}).refine(
  (data) => new Date(data.endDateTime) > new Date(data.startDateTime),
  { message: 'End date must be after start date', path: ['endDateTime'] }
)

export const speakerSchema = z.object({
  firstName:    z.string().min(2).max(100),
  lastName:     z.string().min(2).max(100),
  email:        z.string().email(),
  title:        z.string().max(200).optional(),
  organization: z.string().max(200).optional(),
  bio:          z.string().max(2000).optional(),
  photoUrl:     z.string().url().optional().or(z.literal('')),
  linkedinUrl:  z.string().url().optional().or(z.literal('')),
  websiteUrl:   z.string().url().optional().or(z.literal('')),
})
