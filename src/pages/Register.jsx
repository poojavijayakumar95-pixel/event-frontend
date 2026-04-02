import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { registerSchema } from '../lib/schemas'
import { Button } from '../components/ui'
import { toast } from 'sonner'
import { getErrorMessage, cn } from '../lib/utils'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser(data)
      toast.success('Account created! Welcome to EventHub 🎉')
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, children }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400">{label}</label>
      {children}
      {errors[name] && <p className="text-xs text-red-400 font-body">{errors[name].message}</p>}
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 -right-32 w-72 h-72 rounded-full bg-gold-500/04 blur-3xl pointer-events-none" />

      <motion.div
        className="w-full max-w-lg relative"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-gold-500/12 to-transparent pointer-events-none" />

        <div className="card-luxury p-8">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-lg mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <Sparkles className="w-6 h-6 text-obsidian-950" />
            </motion.div>
            <h1 className="font-display text-2xl font-500 text-obsidian-100 mb-1">Create your account</h1>
            <p className="text-sm font-body text-obsidian-500">Join the EventHub community</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field name="firstName" label="First Name">
                <input {...register('firstName')} placeholder="Jane"
                  className={cn('input-luxury font-body w-full', errors.firstName && 'border-red-500/40')} />
              </Field>
              <Field name="lastName" label="Last Name">
                <input {...register('lastName')} placeholder="Doe"
                  className={cn('input-luxury font-body w-full', errors.lastName && 'border-red-500/40')} />
              </Field>
            </div>

            <Field name="email" label="Email Address">
              <input {...register('email')} type="email" placeholder="you@example.com"
                className={cn('input-luxury font-body w-full', errors.email && 'border-red-500/40')} />
            </Field>

            <Field name="phone" label="Phone (optional)">
              <input {...register('phone')} type="tel" placeholder="+91 98765 43210"
                className="input-luxury font-body w-full" />
            </Field>

            <Field name="password" label="Password">
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                  className={cn('input-luxury font-body pr-10 w-full', errors.password && 'border-red-500/40')}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-obsidian-600 hover:text-obsidian-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <div className="divider-gold mt-6 mb-4" />
          <p className="text-center text-sm font-body text-obsidian-500">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-500 transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
