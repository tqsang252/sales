import React from 'react'
import { SearchX, Inbox, RefreshCw } from 'lucide-react'

export function EmptyState({
  title = 'No posts found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionText = 'Clear Filters',
  onAction,
  icon: Icon = SearchX
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-dashed border-slate-200 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
