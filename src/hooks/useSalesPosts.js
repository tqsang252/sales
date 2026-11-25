import { useState, useEffect, useCallback, useRef } from 'react'
import { salesService } from '../services/salesService'
import { useFavorites } from './useFavorites'

export function useSalesPosts() {
  const { favoriteIds } = useFavorites()

  // Filter States
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [platform, setPlatform] = useState('all')
  const [category, setCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [condition, setCondition] = useState('all')
  const [source, setSource] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  // Data States
  const [posts, setPosts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  // Debounce search input (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page to 1 when any filter changes
  const prevFiltersRef = useRef({ platform, category, minPrice, maxPrice, dateRange, condition, source, sort, favoritesOnly })
  useEffect(() => {
    const prev = prevFiltersRef.current
    if (
      prev.platform !== platform ||
      prev.category !== category ||
      prev.minPrice !== minPrice ||
      prev.maxPrice !== maxPrice ||
      prev.dateRange !== dateRange ||
      prev.condition !== condition ||
      prev.source !== source ||
      prev.sort !== sort ||
      prev.favoritesOnly !== favoritesOnly
    ) {
      setPage(1)
      prevFiltersRef.current = { platform, category, minPrice, maxPrice, dateRange, condition, source, sort, favoritesOnly }
    }
  }, [platform, category, minPrice, maxPrice, dateRange, condition, source, sort, favoritesOnly])

  // Load categories and sources once
  useEffect(() => {
    let isMounted = true
    salesService.getCategories().then(res => {
      if (isMounted && res.data) {
        setCategories(res.data)
      }
    })
    salesService.getSources().then(res => {
      if (isMounted && res.data) {
        setSources(res.data)
      }
    })
    return () => { isMounted = false }
  }, [])

  // Fetch sales posts
  const fetchPosts = useCallback(async (targetPage = 1) => {
    const isFirstPage = targetPage === 1
    if (isFirstPage) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const res = await salesService.getSalesPosts({
        search: debouncedSearch,
        platform,
        category,
        minPrice,
        maxPrice,
        dateRange,
        condition,
        source,
        sort,
        page: targetPage,
        pageSize,
        favoritesOnly,
        favoriteIds
      })

      if (res.error && (!res.data || res.data.length === 0)) {
        throw new Error(res.error)
      }

      const incoming = res.data || []
      setPosts(prev => {
        if (isFirstPage) {
          return incoming
        }
        // Deduplicate incoming posts by id
        const existingIds = new Set(prev.map(p => p.id))
        const uniqueIncoming = incoming.filter(p => !existingIds.has(p.id))
        return [...prev, ...uniqueIncoming]
      })
      setTotalCount(res.count || 0)
    } catch (err) {
      setError(err.message || 'Failed to fetch sales posts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [debouncedSearch, platform, category, minPrice, maxPrice, dateRange, condition, source, sort, pageSize, favoritesOnly, favoriteIds])

  // Trigger fetch when page or filters change
  useEffect(() => {
    fetchPosts(page)
  }, [page, debouncedSearch, platform, category, minPrice, maxPrice, dateRange, condition, source, sort, favoritesOnly, favoriteIds])

  // Infinite Scroll Trigger
  const loadMore = useCallback(() => {
    if (loading || loadingMore) return
    if (posts.length >= totalCount && totalCount > 0) return
    setPage(prev => prev + 1)
  }, [loading, loadingMore, posts.length, totalCount])

  const refresh = useCallback(() => {
    setPage(1)
    return fetchPosts(1)
  }, [fetchPosts])

  const clearFilters = useCallback(() => {
    setSearch('')
    setDebouncedSearch('')
    setPlatform('all')
    setCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setDateRange('all')
    setCondition('all')
    setSource('all')
    setSort('newest')
    setFavoritesOnly(false)
    setPage(1)
  }, [])

  const deletePost = useCallback(async (id) => {
    // Optimistically update UI
    setPosts(prev => prev.filter(p => p.id !== id))
    setTotalCount(c => Math.max(0, c - 1))

    // Call service
    const res = await salesService.deleteSalesPost(id)
    if (res.error) {
      console.error('Failed to delete post:', res.error)
      // Refresh on failure
      refresh()
      return false
    }
    return true
  }, [refresh])

  const hasMore = totalCount === 0 ? false : posts.length < totalCount

  return {
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
    // Filters and Setters
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
  }
}
