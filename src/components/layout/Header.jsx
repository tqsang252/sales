import React from 'react'
import { Menu, RefreshCw, Bell, Database } from 'lucide-react'
import { isSupabaseConfigured } from '../../services/supabaseClient'

export function Header({ onToggleMobile, onRefresh, isRefreshing, title }) {
  const isConnected = isSupabaseConfigured()

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-slate-800 hidden sm:inline">
          Sales Radar
        </span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <span className="text-sm text-slate-500 font-medium">
          {title || 'Dashboard'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Source badge pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {isConnected ? 'Supabase Live' : 'Demo Mock Data'}
        </div>

        {/* Global Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Data"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>
    </header>
  )
}
