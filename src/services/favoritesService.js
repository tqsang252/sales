const STORAGE_KEY = 'sales_radar_favorites'

export const favoritesService = {
  getFavoriteIds: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (err) {
      console.warn('Failed to read favorites from localStorage:', err)
      return []
    }
  },

  isFavorite: (id) => {
    const list = favoritesService.getFavoriteIds()
    return list.includes(id)
  },

  toggleFavorite: (id) => {
    const list = favoritesService.getFavoriteIds()
    let updated
    if (list.includes(id)) {
      updated = list.filter((favId) => favId !== id)
    } else {
      updated = [...list, id]
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('favorites-updated'))
    } catch (err) {
      console.warn('Failed to save favorites to localStorage:', err)
    }
    return updated
  },

  getFavoritesCount: () => {
    return favoritesService.getFavoriteIds().length
  }
}
