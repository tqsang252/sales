import React, { useState, useRef, useEffect } from 'react'
import { Loader2, ArrowUp } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { SalesSearch } from '../components/sales/SalesSearch'
import { SalesFilters } from '../components/sales/SalesFilters'
import { ViewToggle } from '../components/sales/ViewToggle'
import { SalesCard } from '../components/sales/SalesCard'
import { SalesListRow } from '../components/sales/SalesListRow'
import { SalesDetailModal } from '../components/sales/SalesDetailModal'
import { LoadingGrid, LoadingTable } from '../components/common/LoadingState'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { useSalesPosts } from '../hooks/useSalesPosts'
import { useFavorites } from '../hooks/useFavorites'

export function SalesFeedPage() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [selectedPost, setSelectedPost] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sentinelRef = useRef(null)

  const { isFavorite, toggleFavorite } = useFavorites()

  const {
    posts,
    totalCount,
    hasMore,
    categories,
    sources,
    loading,
    loadingMore,
    loadMore,
    error,
    refresh,
    deletePost,
    search,
    setSearch,
    platform,
    setPlatform,
    category,
    setCategory,
    source,
    setSource,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    dateRange,
    setDateRange,
    sort,
    setSort,
    favoritesOnly,
    setFavoritesOnly,
    clearFilters
  } = useSalesPosts()

  // Track scroll position to show "Back to Top" button
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
        rootMargin: '400px', // Pre-fetch 400px before user hits exact bottom
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, loadMore])

  return (
    <div className="relative">
      {/* Page Header */}
      <PageHeader
        title="Sales Feed"
        subtitle="Browse, filter, and track sales posts collected across social platforms"
        onRefresh={refresh}
        isRefreshing={loading}
      >
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {totalCount.toLocaleString()} {totalCount === 1 ? 'Post' : 'Posts'}
        </span>
      </PageHeader>

      {/* Search Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <SalesSearch value={search} onChange={setSearch} />
        <div className="flex items-center justify-end">
          <ViewToggle view={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Filter Component */}
      <SalesFilters
        platform={platform}
        setPlatform={setPlatform}
        category={category}
        setCategory={setCategory}
        categories={categories}
        source={source}
        setSource={setSource}
        sources={sources}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        dateRange={dateRange}
        setDateRange={setDateRange}
        sort={sort}
        setSort={setSort}
        favoritesOnly={favoritesOnly}
        setFavoritesOnly={setFavoritesOnly}
        clearFilters={clearFilters}
      />

      {/* Main Content Area */}
      {error && !loading && posts.length === 0 ? (
        <ErrorState
          title="Could not retrieve sales listings"
          message={error}
          onRetry={refresh}
        />
      ) : loading && posts.length === 0 ? (
        viewMode === 'grid' ? <LoadingGrid count={6} /> : <LoadingTable count={6} />
      ) : posts.length === 0 ? (
        <EmptyState
          title={search || favoritesOnly || source !== 'all' ? 'No matching posts found' : 'No sales posts available'}
          description={
            favoritesOnly
              ? "You haven't saved any favorites yet. Click the bookmark icon on any card to save it."
              : 'Try clearing your search query or relaxing your filters to discover more products.'
          }
          actionText={favoritesOnly ? 'View All Posts' : 'Clear All Filters'}
          onAction={favoritesOnly ? () => setFavoritesOnly(false) : clearFilters}
        />
      ) : viewMode === 'grid' ? (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <SalesCard
              key={post.id}
              post={post}
              isFav={isFavorite(post.id)}
              onToggleFav={toggleFavorite}
              onDelete={deletePost}
              onSelect={setSelectedPost}
            />
          ))}
        </div>
      ) : (
        /* Compact List View */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Product / Post</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-2 text-center">Actions</th>
                <th className="py-3 px-4 text-right">Original</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <SalesListRow
                  key={post.id}
                  post={post}
                  isFav={isFavorite(post.id)}
                  onToggleFav={toggleFavorite}
                  onDelete={deletePost}
                  onSelect={setSelectedPost}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Infinite Scroll Sentinel & Loading Indicator */}
      <div ref={sentinelRef} className="py-8 flex flex-col items-center justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 bg-white px-5 py-2.5 rounded-full shadow-md border border-slate-200 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Loading more posts ({posts.length} of {totalCount})...</span>
          </div>
        )}

        {!hasMore && posts.length > 0 && !loading && (
          <div className="text-center py-6 text-xs text-slate-400 border-t border-slate-200/70 w-full mt-4">
            🎉 You've reached the end • Showing all <span className="font-semibold text-slate-700">{totalCount}</span> posts
          </div>
        )}
      </div>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-blue-600 transition-all duration-200 z-40 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Full Detail Modal Popup */}
      <SalesDetailModal
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        isFav={selectedPost ? isFavorite(selectedPost.id) : false}
        onToggleFav={toggleFavorite}
        onDelete={deletePost}
      />
    </div>
  )
}
