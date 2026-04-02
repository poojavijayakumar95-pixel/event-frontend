import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button, Input, Select } from '../ui'
import { CATEGORIES } from '../../lib/utils'
import { cn } from '../../lib/utils'

export default function SearchBar({ onSearch, loading }) {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [expanded, setExpanded] = useState(false)

  const hasFilters = search || category || location

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({
      search:   search   || undefined,
      category: category || undefined,
      location: location || undefined,
    })
  }

  const handleClear = () => {
    setSearch(''); setCategory(''); setLocation('')
    onSearch({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Main search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-600 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events by title, description…"
            className="input-luxury pl-10 font-body w-full"
          />
        </div>

        <button
          type="button"
          onClick={() => setExpanded(p => !p)}
          className={cn(
            'flex items-center gap-2 px-4 rounded-xl border font-body text-sm font-500 transition-all duration-300 flex-shrink-0',
            expanded || hasFilters
              ? 'border-gold-500/40 bg-gold-500/08 text-gold-400'
              : 'border-obsidian-700/60 text-obsidian-400 hover:border-obsidian-600 hover:text-obsidian-200'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
          )}
        </button>

        <Button type="submit" loading={loading} className="flex-shrink-0">
          Search
        </Button>

        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2.5 rounded-xl border border-obsidian-700/60 text-obsidian-500 hover:text-obsidian-200 hover:border-obsidian-600 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expandable filters */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-500 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="input-luxury font-body cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c.charAt(0) + c.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-body font-600 tracking-widest uppercase text-obsidian-500 mb-1.5">
                  Location
                </label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="City or venue…"
                  className="input-luxury font-body w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
