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
  const fetchPosts = useCallback(async () => {
    setLoading(true)
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
        page,
        pageSize,
        favoritesOnly,
        favoriteIds
      })

      if (res.error && (!res.data || res.data.length === 0)) {
        throw new Error(res.error)
      }

      setPosts(res.data || [])
      setTotalCount(res.count || 0)
    } catch (err) {
      setError(err.message || 'Failed to fetch sales posts')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, platform, category, minPrice, maxPrice, dateRange, condition, source, sort, page, pageSize, favoritesOnly, favoriteIds])

  useEffect(() => {
    fetchPosts()
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
      fetchPosts()
      return false
    }
    return true
  }, [fetchPosts])

  return {
    posts,
    totalCount,
    categories,
    sources,
    loading,
    error,
    refresh: fetchPosts,
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
