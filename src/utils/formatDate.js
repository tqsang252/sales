import { formatDistanceToNow, format, isToday, isThisWeek, parseISO } from 'date-fns'

/**
 * Returns a relative time string (e.g., '2 hours ago', '3 days ago')
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Unknown date'
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Invalid date'
  }
}

/**
 * Returns a formatted date string (e.g. 'Nov 23, 2026')
 */
export function formatStandardDate(dateString) {
  if (!dateString) return '—'
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    return format(date, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

/**
 * Check if a date string is within today (browser local time)
 */
export function checkIsToday(dateString) {
  if (!dateString) return false
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    return isToday(date)
  } catch {
    return false
  }
}

/**
 * Check if a date string is within this week (browser local time)
 */
export function checkIsThisWeek(dateString) {
  if (!dateString) return false
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    return isThisWeek(date, { weekStartsOn: 1 })
  } catch {
    return false
  }
}
