import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/03 blur-3xl pointer-events-none" />

      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <motion.h1
          className="font-display font-300 text-gold-gradient mb-4 select-none"
          style={{ fontSize: 'clamp(6rem, 20vw, 10rem)', lineHeight: 1 }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          404
        </motion.h1>
        <h2 className="font-display text-2xl font-400 text-obsidian-200 mb-3">Page not found</h2>
        <p className="text-sm font-body text-obsidian-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/"><Button size="lg" className="gap-2"><Home className="w-4 h-4" /> Go Home</Button></Link>
          <Link to="/events"><Button variant="ghost" size="lg" className="gap-2"><Search className="w-4 h-4" /> Browse Events</Button></Link>
        </div>
      </motion.div>
    </div>
  )
}
