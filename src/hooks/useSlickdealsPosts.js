import { useState, useEffect, useCallback, useRef } from 'react'
import { slickdealsService } from '../services/slickdealsService'

export function useSlickdealsPosts() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [dealType, setDealType] = useState('all') // 'all' | 'hot' | 'popular' | 'frontpage'
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const [posts, setPosts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page when filter changes
  const prevFilterRef = useRef(dealType)
  useEffect(() => {
    if (prevFilterRef.current !== dealType) {
      setPage(1)
      prevFilterRef.current = dealType
    }
  }, [dealType])

  // Fetch posts
  const fetchPosts = useCallback(async (targetPage = 1) => {
    const isFirstPage = targetPage === 1
    if (isFirstPage) setLoading(true)
    else setLoadingMore(true)
    setError(null)

    try {
      const res = await slickdealsService.getPosts({
        search: debouncedSearch,
        dealType,
        page: targetPage,
        pageSize
      })

      const incoming = res.data || []
      setPosts(prev => {
        if (isFirstPage) return incoming
        const existingIds = new Set(prev.map(p => p.id))
        const unique = incoming.filter(p => !existingIds.has(p.id))
        return [...prev, ...unique]
      })
      setTotalCount(res.count || 0)
    } catch (err) {
      setError(err.message || 'Failed to fetch Slickdeals posts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [debouncedSearch, dealType, pageSize])

  useEffect(() => {
    fetchPosts(page)
  }, [page, debouncedSearch, dealType])

  const loadMore = useCallback(() => {
    if (loading || loadingMore) return
    if (posts.length >= totalCount && totalCount > 0) return
    setPage(prev => prev + 1)
  }, [loading, loadingMore, posts.length, totalCount])

  const refresh = useCallback(() => {
    setPage(1)
    return fetchPosts(1)
  }, [fetchPosts])

  const deletePost = useCallback(async (id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    setTotalCount(c => Math.max(0, c - 1))

    const res = await slickdealsService.deletePost(id)
    if (!res.success) {
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
  }
}
