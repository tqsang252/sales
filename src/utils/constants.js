export const PLATFORMS = [
  { id: 'all', label: 'All Platforms' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'tiktok', label: 'TikTok', color: '#000000', bg: 'bg-slate-900 text-white border-slate-700' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'other', label: 'Other', color: '#64748B', bg: 'bg-gray-100 text-gray-700 border-gray-300' },
]

export const CONDITIONS = [
  { id: 'all', label: 'All Conditions' },
  { id: 'new', label: 'New', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'used', label: 'Used', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'refurbished', label: 'Refurbished', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'unknown', label: 'Unknown', color: 'bg-gray-50 text-gray-600 border-gray-200' },
]

export const DATE_RANGES = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: '7days', label: 'Last 7 Days' },
  { id: '30days', label: 'Last 30 Days' },
]

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
]

export const DEFAULT_PAGE_SIZE = 20
