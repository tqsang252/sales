import React from 'react'

export function PlatformBadge({ platform }) {
  const p = (platform || 'other').toLowerCase()

  const config = {
    facebook: {
      label: 'Facebook',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-[#1877F2]'
    },
    tiktok: {
      label: 'TikTok',
      bg: 'bg-slate-900 text-white border-slate-800',
      dot: 'bg-white'
    },
    instagram: {
      label: 'Instagram',
      bg: 'bg-pink-50 text-pink-700 border-pink-200',
      dot: 'bg-[#E1306C]'
    },
    other: {
      label: 'Other',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500'
    }
  }

  const current = config[p] || config.other

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  )
}
