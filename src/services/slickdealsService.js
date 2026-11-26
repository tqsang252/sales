import { supabase, isSupabaseConfigured } from './supabaseClient'
import { MOCK_SLICKDEALS } from '../mocks/slickdealsPosts'

/**
 * Filter and paginate mock slickdeals data
 */
function queryMockSlickdeals({
  search = '',
  dealType = 'all',
  page = 1,
  pageSize = 20
}) {
  let filtered = [...MOCK_SLICKDEALS]

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filtered = filtered.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.store && p.store.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  }

  if (dealType && dealType !== 'all') {
    filtered = filtered.filter(p => p.deal_type === dealType)
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

  const totalCount = filtered.length
  const startIndex = (page - 1) * pageSize
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize)

  return { data: paginatedData, count: totalCount, error: null }
}

export const slickdealsService = {
  /**
   * Fetch Slickdeals posts with search, filter by deal_type and pagination
   */
  getPosts: async (params = {}) => {
    const {
      search = '',
      dealType = 'all',
      page = 1,
      pageSize = 20
    } = params

    if (!isSupabaseConfigured() || !supabase) {
      await new Promise(r => setTimeout(r, 120))
      return queryMockSlickdeals(params)
    }

    try {
      let query = supabase
        .from('slickdeals_posts')
        .select('*', { count: 'exact' })

      // Filter by deal_type ('hot', 'popular', 'frontpage')
      if (dealType && dealType !== 'all') {
        query = query.eq('deal_type', dealType)
      }

      // Search filter
      if (search && search.trim()) {
        const q = search.trim()
        query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,store.ilike.%${q}%,category.ilike.%${q}%`)
      }

      // Order newest first
      query = query.order('published_at', { ascending: false })

      // Range pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, count, error } = await query

      if (error) {
        // Table might not exist yet in user's Supabase, fallback to mock
        console.warn('Falling back to mock Slickdeals data:', error.message)
        return queryMockSlickdeals(params)
      }

      // If database table is empty, show mock so user can experience the UI right away
      if ((!data || data.length === 0) && page === 1 && !search && dealType === 'all') {
        return queryMockSlickdeals(params)
      }

      return { data: data || [], count: count || 0, error: null }
    } catch (err) {
      console.error('Error fetching Slickdeals posts:', err)
      return queryMockSlickdeals(params)
    }
  },

  /**
   * Delete a Slickdeals post
   */
  deletePost: async (id) => {
    if (!isSupabaseConfigured() || !supabase) {
      const idx = MOCK_SLICKDEALS.findIndex(p => p.id === id)
      if (idx !== -1) MOCK_SLICKDEALS.splice(idx, 1)
      return { success: true, error: null }
    }

    try {
      const { error } = await supabase
        .from('slickdeals_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true, error: null }
    } catch (err) {
      console.error('Error deleting Slickdeals post:', err)
      return { success: false, error: err.message }
    }
  }
}
