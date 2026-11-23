import React from 'react'
import { LayoutDashboard, Calendar, Flame, Bookmark, AlertCircle } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { StatCard } from '../components/dashboard/StatCard'
import { PostsByPlatformChart } from '../components/dashboard/PostsByPlatformChart'
import { PostsByCategoryChart } from '../components/dashboard/PostsByCategoryChart'
import { RecentPosts } from '../components/dashboard/RecentPosts'
import { ErrorState } from '../components/common/ErrorState'
import { useDashboardStats } from '../hooks/useDashboardStats'

export function DashboardPage() {
  const {
    stats,
    platformData,
    categoryData,
    recentPosts,
    loading,
    error,
    refresh
  } = useDashboardStats()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your collected sales posts across social channels"
        onRefresh={refresh}
        isRefreshing={loading}
      />

      {error && !loading && (
        <div className="mb-6">
          <ErrorState
            title="Unable to load complete dashboard"
            message={error}
            onRetry={refresh}
          />
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          subtitle="All aggregated listings"
          icon={LayoutDashboard}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Posts Today"
          value={stats.postsToday}
          subtitle="Published in the last 24h"
          icon={Calendar}
          color="emerald"
          loading={loading}
        />
        <StatCard
          title="Posts This Week"
          value={stats.postsThisWeek}
          subtitle="Published since Monday"
          icon={Flame}
          color="amber"
          loading={loading}
        />
        <StatCard
          title="Favorites"
          value={stats.favoritesCount}
          subtitle="Saved for quick access"
          icon={Bookmark}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PostsByPlatformChart data={platformData} loading={loading} />
        <PostsByCategoryChart data={categoryData} loading={loading} />
      </div>

      {/* Recent Posts Section */}
      <RecentPosts posts={recentPosts} loading={loading} />
    </div>
  )
}
