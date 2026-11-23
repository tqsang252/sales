import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export function ErrorState({
  title = 'Failed to load data',
  message = 'There was an error communicating with the database. Please try again.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-red-50/50 rounded-xl border border-red-200 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Now
        </button>
      )}
    </div>
  )
}
