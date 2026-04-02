import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { loginSchema } from '../lib/schemas'
import { Button } from '../components/ui'
import { toast } from 'sonner'
import { getErrorMessage, cn } from '../lib/utils'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-gold-500/04 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-gold-500/03 blur-3xl pointer-events-none" />

      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Glow ring */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-gold-500/15 to-transparent pointer-events-none" />

        <div className="card-luxury p-8">
          {/* Logo mark */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-lg mb-4"
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <Sparkles className="w-6 h-6 text-obsidian-950" />
            </motion.div>
            <h1 className="font-display text-2xl font-500 text-obsidian-100 mb-1">
              Welcome back
            </h1>
            <p className="text-sm font-body text-obsidian-500">
              Sign in to your EventHub account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-600 pointer-events-none" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={cn('input-luxury font-body pl-10 w-full', errors.email && 'border-red-500/40')}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 font-body">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-600 pointer-events-none" />
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn('input-luxury font-body pl-10 pr-10 w-full', errors.password && 'border-red-500/40')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-obsidian-600 hover:text-obsidian-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 font-body">{errors.password.message}</p>}
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="divider-gold mt-6 mb-4" />

          <p className="text-center text-sm font-body text-obsidian-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-500 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
