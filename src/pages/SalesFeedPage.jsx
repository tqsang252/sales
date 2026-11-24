import React, { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { SalesSearch } from '../components/sales/SalesSearch'
import { SalesFilters } from '../components/sales/SalesFilters'
import { ViewToggle } from '../components/sales/ViewToggle'
import { SalesCard } from '../components/sales/SalesCard'
import { SalesListRow } from '../components/sales/SalesListRow'
import { SalesPagination } from '../components/sales/SalesPagination'
import { SalesDetailModal } from '../components/sales/SalesDetailModal'
import { LoadingGrid, LoadingTable } from '../components/common/LoadingState'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { useSalesPosts } from '../hooks/useSalesPosts'
import { useFavorites } from '../hooks/useFavorites'

export function SalesFeedPage() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [selectedPost, setSelectedPost] = useState(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  const {
    posts,
    totalCount,
    categories,
    loading,
    error,
    refresh,
    deletePost,
    search,
    setSearch,
    platform,
    setPlatform,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    dateRange,
    setDateRange,
    condition,
    setCondition,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    favoritesOnly,
    setFavoritesOnly,
    clearFilters
  } = useSalesPosts()

  return (
    <div>
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
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        dateRange={dateRange}
        setDateRange={setDateRange}
        condition={condition}
        setCondition={setCondition}
        sort={sort}
        setSort={setSort}
        favoritesOnly={favoritesOnly}
        setFavoritesOnly={setFavoritesOnly}
        clearFilters={clearFilters}
      />

      {/* Main Content Area */}
      {error && !loading ? (
        <ErrorState
          title="Could not retrieve sales listings"
          message={error}
          onRetry={refresh}
        />
      ) : loading ? (
        viewMode === 'grid' ? <LoadingGrid count={6} /> : <LoadingTable count={6} />
      ) : posts.length === 0 ? (
        <EmptyState
          title={search || favoritesOnly ? 'No matching posts found' : 'No sales posts available'}
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

      {/* Pagination */}
      {!loading && posts.length > 0 && (
        <SalesPagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setPage(1)
          }}
        />
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
