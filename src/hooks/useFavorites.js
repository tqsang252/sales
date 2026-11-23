import { useState, useEffect, useCallback } from 'react'
import { favoritesService } from '../services/favoritesService'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(() => favoritesService.getFavoriteIds())

  useEffect(() => {
    const handleSync = () => {
      setFavoriteIds(favoritesService.getFavoriteIds())
    }

    window.addEventListener('favorites-updated', handleSync)
    window.addEventListener('storage', handleSync)

    return () => {
      window.removeEventListener('favorites-updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const isFavorite = useCallback((id) => {
    return favoriteIds.includes(id)
  }, [favoriteIds])

  const toggleFavorite = useCallback((id) => {
    const updated = favoritesService.toggleFavorite(id)
    setFavoriteIds(updated)
  }, [])

  return {
    favoriteIds,
    count: favoriteIds.length,
    isFavorite,
    toggleFavorite
  }
}
