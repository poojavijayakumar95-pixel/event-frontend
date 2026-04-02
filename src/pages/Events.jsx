import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { eventsApi, queryKeys } from '../api'
import EventCard from '../components/events/EventCard'
import SearchBar from '../components/events/SearchBar'
import Pagination from '../components/ui/Pagination'
import { PageLoader, EmptyState, Skeleton, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const CARD_SKELETON = Array.from({ length: 6 })

export default function Events() {
  const [page, setPage] = useState(0)
  const [searchParams, setSearchParams] = useState({})
  const isSearching = Object.values(searchParams).some(Boolean)

  const browseQuery = useQuery({
    queryKey: queryKeys.events.list({ page }),
    queryFn: () => eventsApi.getAll(page, 9).then(r => r.data),
    enabled: !isSearching,
    staleTime: 60_000,
    keepPreviousData: true,
  })

  const [searchPage, setSearchPage] = useState(0)
  const searchQuery = useQuery({
    queryKey: queryKeys.events.search({ ...searchParams, page: searchPage }),
    queryFn: () => eventsApi.search({ ...searchParams, page: searchPage, size: 9 }).then(r => r.data),
    enabled: isSearching,
    staleTime: 30_000,
    keepPreviousData: true,
  })

  const active = isSearching ? searchQuery : browseQuery
  const activePage = isSearching ? searchPage : page
  const setActivePage = isSearching ? setSearchPage : setPage

  const handleSearch = useCallback((params) => {
    setSearchParams(params)
    setSearchPage(0)
    setPage(0)
  }, [])

  return (
    <div className="py-10 pb-20">
      <div className="page-container">

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <p className="text-xs font-body font-600 tracking-widest uppercase text-gold-600 mb-3">
            Discover
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-300 text-obsidian-100 mb-3 line-gold">
            Upcoming Events
          </h1>
          <p className="text-base font-body text-obsidian-500 max-w-xl">
            Conferences, workshops, networking and more — curated for professionals.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar onSearch={handleSearch} loading={active.isFetching} />
        </motion.div>

        {/* Count */}
        {active.data && (
          <motion.p
            className="text-xs font-body font-600 tracking-widest uppercase text-obsidian-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {active.data.totalElements} event{active.data.totalElements !== 1 ? 's' : ''} found
          </motion.p>
        )}

        {/* Grid */}
        {active.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CARD_SKELETON.map((_, i) => (
              <div key={i} className="card-luxury overflow-hidden">
                <Skeleton className="h-44 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : active.isError ? (
          <div className="text-center py-20">
            <p className="text-obsidian-500 font-body">Failed to load events. Please try again.</p>
            <Button variant="ghost" className="mt-4" onClick={() => active.refetch()}>Retry</Button>
          </div>
        ) : active.data?.content?.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="Try adjusting your search filters or check back later for new events."
            action={isSearching && (
              <Button variant="ghost" onClick={() => handleSearch({})}>Clear Filters</Button>
            )}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {active.data.content.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
            <Pagination
              page={activePage}
              totalPages={active.data.totalPages}
              onPageChange={setActivePage}
            />
          </>
        )}
      </div>
    </div>
  )
}
