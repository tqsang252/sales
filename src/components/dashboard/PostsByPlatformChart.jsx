import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { Share2 } from 'lucide-react'

const PLATFORM_COLORS = {
  facebook: '#1877F2',
  tiktok: '#0F172A',
  instagram: '#E1306C',
  other: '#64748B'
}

export function PostsByPlatformChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs h-[300px] flex flex-col justify-between animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="h-44 w-full bg-slate-100 rounded" />
      </div>
    )
  }

  const hasData = data && data.length > 0 && data.some(d => d.value > 0)

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Posts by Platform</h3>
          <p className="text-xs text-slate-500">Distribution across monitored channels</p>
        </div>
        <Share2 className="w-4 h-4 text-slate-400" />
      </div>

      <div className="h-[220px] w-full">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No platform data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: '#F1F5F9' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-slate-300 mt-0.5">{item.value} posts</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => {
                  const plat = (entry.platform || entry.name || '').toLowerCase()
                  const fill = PLATFORM_COLORS[plat] || '#3B82F6'
                  return <Cell key={`cell-${index}`} fill={fill} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
