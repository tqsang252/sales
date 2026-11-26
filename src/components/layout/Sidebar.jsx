import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Radio, Radar, Bookmark, Database, Flame } from 'lucide-react'
import { isSupabaseConfigured } from '../../services/supabaseClient'

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const isConnected = isSupabaseConfigured()

  const navItems = [
    // Dashboard temporarily hidden, ready to be enabled later
    // { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Sales Feed', to: '/', icon: Radio },
    { name: 'Slickdeals', to: '/slickdeals', icon: Flame },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#172033] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Radar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              Sales Radar
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                MVP
              </span>
            </h1>
            <p className="text-xs text-slate-400">Social Sales Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        {/* Supabase Status Footer Indicator */}
        <div className="p-4 border-t border-slate-800/80 m-3 rounded-lg bg-slate-900/60">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-200">Data Source</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-xs text-slate-400">
              {isConnected ? 'Supabase Connected' : 'Mock Data Mode'}
            </span>
          </div>
          {!isConnected && (
            <p className="text-[11px] text-slate-400 mt-1 leading-tight">
              Add Supabase keys in <code className="text-amber-300">.env</code> to link live DB.
            </p>
          )}
        </div>
      </aside>
    </>
  )
}
