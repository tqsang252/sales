import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '../services/dashboardService'

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    postsToday: 0,
    postsThisWeek: 0,
    favoritesCount: 0
  })
  const [platformData, setPlatformData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, platformRes, categoryRes, recentRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getPostsByPlatform(),
        dashboardService.getPostsByCategory(),
        dashboardService.getRecentPosts(6)
      ])

      if (statsRes.error && !statsRes.data) {
        throw new Error(statsRes.error)
      }

      setStats(statsRes.data || {})
      setPlatformData(platformRes.data || [])
      setCategoryData(categoryRes.data || [])
      setRecentPosts(recentRes.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Also update favorites count whenever favorites change
    const handleFavChange = () => {
      setStats(prev => ({
        ...prev,
        favoritesCount: (JSON.parse(localStorage.getItem('sales_radar_favorites') || '[]')).length
      }))
    }
    window.addEventListener('favorites-updated', handleFavChange)
    return () => window.removeEventListener('favorites-updated', handleFavChange)
  }, [fetchData])

  return {
    stats,
    platformData,
    categoryData,
    recentPosts,
    loading,
    error,
    refresh: fetchData
  }
}
