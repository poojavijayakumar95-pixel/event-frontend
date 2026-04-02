import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  Calendar, LayoutDashboard, LogOut, Menu, X,
  Shield, ChevronDown, Sparkles, User
} from 'lucide-react'
import { Button } from '../ui'
import { cn } from '../../lib/utils'

const navLinks = [
  { to: '/events', label: 'Events' },
]

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          scrolled
            ? 'bg-obsidian-950/95 backdrop-blur-xl border-b border-gold-500/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Sparkles className="w-4 h-4 text-obsidian-950" />
              </motion.div>
              <span className="font-display text-lg font-600 text-obsidian-100 group-hover:text-gold-400 transition-colors">
                EventHub
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => cn(
                    'px-4 py-2 rounded-lg text-sm font-body font-500 transition-all duration-200',
                    isActive
                      ? 'text-gold-400 bg-gold-500/08'
                      : 'text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800/50'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => cn(
                    'px-4 py-2 rounded-lg text-sm font-body font-500 transition-all duration-200 flex items-center gap-1.5',
                    isActive
                      ? 'text-gold-400 bg-gold-500/08'
                      : 'text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800/50'
                  )}
                >
                  <Shield className="w-3.5 h-3.5" /> Admin
                </NavLink>
              )}
            </div>

            {/* Auth area */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(p => !p)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-obsidian-700/60 hover:border-gold-500/30 bg-obsidian-900/50 hover:bg-obsidian-800/50 transition-all duration-300 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center text-obsidian-950 text-xs font-display font-600">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <span className="text-sm font-body font-500 text-obsidian-300 group-hover:text-obsidian-100">
                      {user.firstName}
                    </span>
                    <ChevronDown className={cn(
                      'w-3.5 h-3.5 text-obsidian-500 transition-transform duration-200',
                      dropOpen && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-56 card-luxury border border-gold-500/10 shadow-gold overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        onMouseLeave={() => setDropOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-gold-500/08">
                          <p className="text-sm font-body font-600 text-obsidian-100">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs font-body text-obsidian-500 mt-0.5 truncate">
                            {user.email}
                          </p>
                          {isAdmin && (
                            <span className="badge-gold text-[10px] mt-1.5 inline-flex">
                              <Shield className="w-2.5 h-2.5" /> Admin
                            </span>
                          )}
                        </div>
                        <div className="p-1.5">
                          <DropItem to="/dashboard" icon={LayoutDashboard} label="My Dashboard" onClick={() => setDropOpen(false)} />
                          {isAdmin && <DropItem to="/admin" icon={Shield} label="Admin Panel" onClick={() => setDropOpen(false)} />}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body text-red-400 hover:bg-red-500/08 hover:text-red-300 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800/50 transition-colors"
              onClick={() => setMobileOpen(p => !p)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }}><X className="w-5 h-5" /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90 }} animate={{ rotate: 0 }}><Menu className="w-5 h-5" /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-obsidian-950/98 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="relative h-full overflow-y-auto p-6 flex flex-col gap-2"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {navLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={link.to} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-obsidian-200 hover:text-gold-400 hover:bg-gold-500/08 font-body font-500 transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-obsidian-200 hover:text-gold-400 hover:bg-gold-500/08 font-body font-500 transition-colors">
                  <Shield className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <div className="divider-gold my-2" />
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-obsidian-200 hover:text-gold-400 hover:bg-gold-500/08 font-body font-500 transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/08 font-body font-500 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login"><Button variant="ghost" className="w-full">Sign In</Button></Link>
                  <Link to="/register"><Button className="w-full">Get Started</Button></Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

function DropItem({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body text-obsidian-300 hover:bg-obsidian-800/60 hover:text-obsidian-100 transition-colors"
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  )
}
