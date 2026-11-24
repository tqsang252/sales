import { supabase, isSupabaseConfigured } from './supabaseClient'
import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_SOURCES } from '../mocks/salesPosts'

/**
 * Filter and sort mock posts for development/demo mode
 */
function queryMockPosts({
  search = '',
  platform = 'all',
  category = 'all',
  minPrice = '',
  maxPrice = '',
  dateRange = 'all',
  condition = 'all',
  source = 'all',
  sort = 'newest',
  page = 1,
  pageSize = 20,
  favoritesOnly = false,
  favoriteIds = []
}) {
  let filtered = [...MOCK_POSTS]

  if (favoritesOnly) {
    filtered = filtered.filter(p => favoriteIds.includes(p.id))
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filtered = filtered.filter(p =>
      (p.product_name && p.product_name.toLowerCase().includes(q)) ||
      (p.content && p.content.toLowerCase().includes(q)) ||
      (p.author_name && p.author_name.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q))
    )
  }

  if (platform && platform !== 'all') {
    filtered = filtered.filter(p => p.platform?.toLowerCase() === platform.toLowerCase())
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category_id === category || p.category_name === category)
  }

  if (minPrice !== '' && !isNaN(Number(minPrice))) {
    filtered = filtered.filter(p => p.price !== null && Number(p.price) >= Number(minPrice))
  }

  if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
    filtered = filtered.filter(p => p.price !== null && Number(p.price) <= Number(maxPrice))
  }

  if (condition && condition !== 'all') {
    filtered = filtered.filter(p => p.condition?.toLowerCase() === condition.toLowerCase())
  }

  if (source && source !== 'all') {
    filtered = filtered.filter(p => p.source_id === source || p.group_name === source || p.source_name === source)
  }

  if (dateRange && dateRange !== 'all') {
    const now = new Date()
    filtered = filtered.filter(p => {
      if (!p.published_at) return false
      const pubDate = new Date(p.published_at)
      const diffMs = now.getTime() - pubDate.getTime()
      if (dateRange === 'today') return diffMs <= 24 * 60 * 60 * 1000
      if (dateRange === '7days') return diffMs <= 7 * 24 * 60 * 60 * 1000
      if (dateRange === '30days') return diffMs <= 30 * 24 * 60 * 60 * 1000
      return true
    })
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    }
    if (sort === 'oldest') {
      return new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
    }
    if (sort === 'price_asc') {
      const priceA = a.price !== null ? Number(a.price) : Infinity
      const priceB = b.price !== null ? Number(b.price) : Infinity
      return priceA - priceB
    }
    if (sort === 'price_desc') {
      const priceA = a.price !== null ? Number(a.price) : -Infinity
      const priceB = b.price !== null ? Number(b.price) : -Infinity
      return priceB - priceA
    }
    return 0
  })

  const totalCount = filtered.length
  const startIndex = (page - 1) * pageSize
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize)

  return { data: paginatedData, count: totalCount, error: null }
}

export const salesService = {
  /**
   * Fetch categories from Supabase or fallback to mock
   */
  getCategories: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: MOCK_CATEGORIES, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (err) {
      console.error('Error fetching categories from Supabase:', err)
      return { data: MOCK_CATEGORIES, error: err.message }
    }
  },

  /**
   * Fetch sources from Supabase or fallback to mock (combines sources table + distinct group_names)
   */
  getSources: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      const list = [...MOCK_SOURCES]
      const existingNames = new Set(list.map(s => s.name?.toLowerCase()))
      MOCK_POSTS.forEach(p => {
        if (p.group_name && !existingNames.has(p.group_name.toLowerCase())) {
          existingNames.add(p.group_name.toLowerCase())
          list.push({ id: p.group_name, name: p.group_name, platform: p.platform || 'facebook' })
        }
      })
      return { data: list, error: null }
    }

    try {
      // 1. Fetch from sources table
      const { data: sourcesData } = await supabase
        .from('sources')
        .select('id, name, platform, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true })

      const combined = sourcesData ? [...sourcesData] : []
      const existingNames = new Set(combined.map(s => s.name?.toLowerCase()))

      // 2. Also fetch distinct group_names from sales_posts
      const { data: postsData } = await supabase
        .from('sales_posts')
        .select('group_name')
        .not('group_name', 'is', null)

      if (postsData) {
        postsData.forEach(p => {
          if (p.group_name && !existingNames.has(p.group_name.toLowerCase())) {
            existingNames.add(p.group_name.toLowerCase())
            combined.push({
              id: p.group_name,
              name: p.group_name,
              platform: 'facebook'
            })
          }
        })
      }

      return { data: combined, error: null }
    } catch (err) {
      console.error('Error fetching sources from Supabase:', err)
      return { data: MOCK_SOURCES, error: err.message }
    }
  },

  /**
   * Fetch sales posts with filters, search, sorting and server-side pagination
   */
  getSalesPosts: async (params = {}) => {
    const {
      search = '',
      platform = 'all',
      category = 'all',
      minPrice = '',
      maxPrice = '',
      dateRange = 'all',
      condition = 'all',
      source = 'all',
      sort = 'newest',
      page = 1,
      pageSize = 20,
      favoritesOnly = false,
      favoriteIds = []
    } = params

    if (!isSupabaseConfigured() || !supabase) {
      // Simulate minor network latency for realistic UX feel
      await new Promise(r => setTimeout(r, 150))
      return queryMockPosts(params)
    }

    try {
      let query = supabase
        .from('sales_posts')
        .select(`
          id,
          source_id,
          external_post_id,
          original_url,
          author_name,
          group_name,
          content,
          image_url,
          product_name,
          category_id,
          price,
          currency,
          location,
          condition,
          published_at,
          sources (
            name,
            platform
          ),
          categories (
            name,
            slug
          )
        `, { count: 'exact' })

      // Favorites only filter
      if (favoritesOnly) {
        if (!favoriteIds || favoriteIds.length === 0) {
          return { data: [], count: 0, error: null }
        }
        query = query.in('id', favoriteIds)
      }

      // Search filter
      if (search && search.trim()) {
        const q = search.trim()
        query = query.or(`product_name.ilike.%${q}%,content.ilike.%${q}%,author_name.ilike.%${q}%,location.ilike.%${q}%`)
      }

      // Platform filter (joined via sources)
      if (platform && platform !== 'all') {
        query = query.eq('sources.platform', platform)
      }

      // Category filter
      if (category && category !== 'all') {
        query = query.eq('category_id', category)
      }

      // Condition filter
      if (condition && condition !== 'all') {
        query = query.eq('condition', condition)
      }

      // Source / Group filter
      if (source && source !== 'all') {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(source)
        if (isUuid) {
          query = query.eq('source_id', source)
        } else {
          query = query.eq('group_name', source)
        }
      }

      // Price filters
      if (minPrice !== '' && !isNaN(Number(minPrice))) {
        query = query.gte('price', Number(minPrice))
      }
      if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
        query = query.lte('price', Number(maxPrice))
      }

      // Date range filter
      if (dateRange && dateRange !== 'all') {
        const now = new Date()
        let threshold
        if (dateRange === 'today') {
          threshold = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        } else if (dateRange === '7days') {
          threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        } else if (dateRange === '30days') {
          threshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
        if (threshold) {
          query = query.gte('published_at', threshold)
        }
      }

      // Sorting
      if (sort === 'newest') {
        query = query.order('published_at', { ascending: false })
      } else if (sort === 'oldest') {
        query = query.order('published_at', { ascending: true })
      } else if (sort === 'price_asc') {
        query = query.order('price', { ascending: true, nullsFirst: false })
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false, nullsFirst: false })
      }

      // Server-side Range Pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, count, error } = await query

      if (error) throw error

      // Flatten nested joined sources/categories for convenience
      const normalizedData = (data || []).map(item => ({
        ...item,
        platform: item.sources?.platform || 'other',
        source_name: item.sources?.name,
        category_name: item.categories?.name,
      }))

      return { data: normalizedData, count: count || 0, error: null }
    } catch (err) {
      console.error('Error fetching sales posts from Supabase:', err)
      // Fallback to mock data with warning so user can continue testing UI
      const mockResult = queryMockPosts(params)
      return { ...mockResult, error: err.message }
    }
  },

  /**
   * Delete a sales post by ID
   */
  deleteSalesPost: async (id) => {
    if (!isSupabaseConfigured() || !supabase) {
      // In mock mode, delete from MOCK_POSTS in memory
      const index = MOCK_POSTS.findIndex(p => p.id === id)
      if (index !== -1) {
        MOCK_POSTS.splice(index, 1)
      }
      return { success: true, error: null }
    }

    try {
      const { error } = await supabase
        .from('sales_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true, error: null }
    } catch (err) {
      console.error('Error deleting post from Supabase:', err)
      return { success: false, error: err.message }
    }
  }
}
