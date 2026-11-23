import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Tag } from 'lucide-react'

export function PostsByCategoryChart({ data = [], loading = false }) {
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
          <h3 className="text-base font-semibold text-slate-900">Posts by Category</h3>
          <p className="text-xs text-slate-500">Breakdown of products by classified group</p>
        </div>
        <Tag className="w-4 h-4 text-slate-400" />
      </div>

      <div className="h-[220px] w-full">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No category data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data.slice(0, 5)}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748B' }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#334155' }}
                width={110}
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
              <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
