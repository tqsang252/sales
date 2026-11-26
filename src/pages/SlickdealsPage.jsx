import React, { useState, useRef, useEffect } from 'react'
import { Flame, Star, Award, Search, X, Loader2, ArrowUp, RefreshCw, Zap } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { SlickdealsCard } from '../components/slickdeals/SlickdealsCard'
import { SlickdealsDetailModal } from '../components/slickdeals/SlickdealsDetailModal'
import { LoadingGrid } from '../components/common/LoadingState'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { useSlickdealsPosts } from '../hooks/useSlickdealsPosts'

export function SlickdealsPage() {
  const [selectedPost, setSelectedPost] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sentinelRef = useRef(null)

  const {
    posts,
    totalCount,
    hasMore,
    loading,
    loadingMore,
    loadMore,
    error,
    refresh,
    deletePost,
    search,
    setSearch,
    dealType,
    setDealType
  } = useSlickdealsPosts()

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loading || loadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      {
        rootMargin: '400px',
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, loadMore])

  const dealTypePills = [
    { id: 'all', label: 'All Deals', icon: Zap },
    { id: 'hot', label: '🔥 Hot Deals / Glitches', icon: Flame },
    { id: 'popular', label: '⭐ Popular Deals', icon: Star },
    { id: 'frontpage', label: '🏆 Frontpage Deals', icon: Award },
  ]

  return (
    <div className="relative">
      {/* Page Header */}
      <PageHeader
        title="Slickdeals US Radar"
        subtitle="Live price glitches, clearance markdowns, and top-voted deals across US retailers"
        onRefresh={refresh}
        isRefreshing={loading}
      >
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
          {totalCount.toLocaleString()} {totalCount === 1 ? 'Deal' : 'Deals'}
        </span>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs mb-6 space-y-3">
        {/* Deal Type Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {dealTypePills.map((pill) => {
            const Icon = pill.icon
            const isActive = dealType === pill.id
            return (
              <button
                key={pill.id}
                onClick={() => setDealType(pill.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{pill.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Slickdeals by product name, brand, store (Amazon, Walmart, Best Buy)..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {error && !loading && posts.length === 0 ? (
        <ErrorState
          title="Could not load Slickdeals feed"
          message={error}
          onRetry={refresh}
        />
      ) : loading && posts.length === 0 ? (
        <LoadingGrid count={6} />
      ) : posts.length === 0 ? (
        <EmptyState
          title={search || dealType !== 'all' ? 'No matching deals found' : 'No Slickdeals records found'}
          description="Try selecting 'All Deals' or searching for another keyword."
          actionText="View All Deals"
          onAction={() => {
            setSearch('')
            setDealType('all')
          }}
        />
      ) : (
        /* Deals Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <SlickdealsCard
              key={post.id}
              post={post}
              onDelete={deletePost}
              onSelect={setSelectedPost}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel & Loader */}
      <div ref={sentinelRef} className="py-8 flex flex-col items-center justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 bg-white px-5 py-2.5 rounded-full shadow-md border border-slate-200 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-red-600" />
            <span>Loading more Slickdeals ({posts.length} of {totalCount})...</span>
          </div>
        )}

        {!hasMore && posts.length > 0 && !loading && (
          <div className="text-center py-6 text-xs text-slate-400 border-t border-slate-200/70 w-full mt-4">
            🔥 You're all caught up • Showing all <span className="font-semibold text-slate-700">{totalCount}</span> Slickdeals
          </div>
        )}
      </div>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-blue-600 transition-all duration-200 z-40 flex items-center justify-center group focus:outline-none"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Detail Modal Popup */}
      <SlickdealsDetailModal
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        onDelete={deletePost}
      />
    </div>
  )
}
