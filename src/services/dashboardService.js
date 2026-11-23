import { supabase, isSupabaseConfigured } from './supabaseClient'
import { MOCK_POSTS } from '../mocks/salesPosts'
import { favoritesService } from './favoritesService'
import { checkIsToday, checkIsThisWeek } from '../utils/formatDate'

export const dashboardService = {
  /**
   * Get KPI statistics: Total Posts, Today's Posts, This Week's Posts, Favorites Count
   */
  getStats: async () => {
    const favoritesCount = favoritesService.getFavoritesCount()

    if (!isSupabaseConfigured() || !supabase) {
      const totalPosts = MOCK_POSTS.length
      const postsToday = MOCK_POSTS.filter(p => checkIsToday(p.published_at)).length
      const postsThisWeek = MOCK_POSTS.filter(p => checkIsThisWeek(p.published_at)).length

      return {
        data: {
          totalPosts,
          postsToday,
          postsThisWeek,
          favoritesCount
        },
        error: null
      }
    }

    try {
      // 1. Total Posts
      const { count: totalPosts, error: totalErr } = await supabase
        .from('sales_posts')
        .select('*', { count: 'exact', head: true })

      if (totalErr) throw totalErr

      // 2. Posts Today (start of current day in local ISO)
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const { count: postsToday, error: todayErr } = await supabase
        .from('sales_posts')
        .select('*', { count: 'exact', head: true })
        .gte('published_at', startOfToday)

      if (todayErr) throw todayErr

      // 3. Posts This Week (Monday of this week in local)
      const dayOfWeek = (now.getDay() + 6) % 7 // Monday = 0
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).toISOString()
      const { count: postsThisWeek, error: weekErr } = await supabase
        .from('sales_posts')
        .select('*', { count: 'exact', head: true })
        .gte('published_at', startOfWeek)

      if (weekErr) throw weekErr

      return {
        data: {
          totalPosts: totalPosts || 0,
          postsToday: postsToday || 0,
          postsThisWeek: postsThisWeek || 0,
          favoritesCount
        },
        error: null
      }
    } catch (err) {
      console.error('Error fetching dashboard stats from Supabase:', err)
      // Fallback calculation on mock
      return {
        data: {
          totalPosts: MOCK_POSTS.length,
          postsToday: MOCK_POSTS.filter(p => checkIsToday(p.published_at)).length,
          postsThisWeek: MOCK_POSTS.filter(p => checkIsThisWeek(p.published_at)).length,
          favoritesCount
        },
        error: err.message
      }
    }
  },

  /**
   * Get post counts grouped by platform
   */
  getPostsByPlatform: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      const counts = {}
      MOCK_POSTS.forEach(p => {
        const plat = p.platform || 'other'
        counts[plat] = (counts[plat] || 0) + 1
      })
      const result = Object.entries(counts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        platform: name,
        value
      }))
      return { data: result, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('sales_posts')
        .select(`
          id,
          sources (
            platform
          )
        `)

      if (error) throw error

      const counts = {}
      ;(data || []).forEach(item => {
        const platform = item.sources?.platform || 'other'
        counts[platform] = (counts[platform] || 0) + 1
      })

      const formatted = Object.entries(counts).map(([plat, value]) => ({
        name: plat.charAt(0).toUpperCase() + plat.slice(1),
        platform: plat,
        value
      }))

      return { data: formatted, error: null }
    } catch (err) {
      console.error('Error getting platform distribution:', err)
      return { data: [], error: err.message }
    }
  },

  /**
   * Get post counts grouped by category
   */
  getPostsByCategory: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      const counts = {}
      MOCK_POSTS.forEach(p => {
        const cat = p.category_name || 'Uncategorized'
        counts[cat] = (counts[cat] || 0) + 1
      })
      const result = Object.entries(counts).map(([name, value]) => ({
        name,
        value
      })).sort((a, b) => b.value - a.value)

      return { data: result, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('sales_posts')
        .select(`
          id,
          categories (
            name
          )
        `)

      if (error) throw error

      const counts = {}
      ;(data || []).forEach(item => {
        const name = item.categories?.name || 'Uncategorized'
        counts[name] = (counts[name] || 0) + 1
      })

      const formatted = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

      return { data: formatted, error: null }
    } catch (err) {
      console.error('Error getting category distribution:', err)
      return { data: [], error: err.message }
    }
  },

  /**
   * Get recent 5-10 sales posts for the Dashboard table/list
   */
  getRecentPosts: async (limit = 6) => {
    if (!isSupabaseConfigured() || !supabase) {
      const sorted = [...MOCK_POSTS]
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        .slice(0, limit)
      return { data: sorted, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('sales_posts')
        .select(`
          id,
          product_name,
          price,
          currency,
          published_at,
          image_url,
          original_url,
          location,
          sources (
            name,
            platform
          ),
          categories (
            name
          )
        `)
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      const normalized = (data || []).map(p => ({
        ...p,
        platform: p.sources?.platform || 'other',
        source_name: p.sources?.name,
        category_name: p.categories?.name
      }))

      return { data: normalized, error: null }
    } catch (err) {
      console.error('Error fetching recent posts:', err)
      return { data: [], error: err.message }
    }
  }
}
