import React, { useState } from 'react'
import { Flame, Star, Award, Store, Trash2, ExternalLink, Eye, Tag } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelativeTime } from '../../utils/formatDate'

export function SlickdealsCard({ post, onDelete, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    id,
    title,
    link,
    description,
    image_url,
    price,
    price_raw,
    store,
    score,
    deal_type,
    category,
    creator,
    published_at
  } = post

  const hasImage = Boolean(image_url) && !imgFailed

  const dealTypeBadge = {
    hot: { label: 'Hot / Glitch', bg: 'bg-red-50 text-red-700 border-red-200', icon: Flame },
    popular: { label: 'Popular', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Star },
    frontpage: { label: 'Frontpage', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Award }
  }[deal_type] || { label: 'Deal', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Award }

  const TypeIcon = dealTypeBadge.icon

  const handleDelete = (e) => {
    e.stopPropagation()
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    onDelete(id)
  }

  return (
    <div
      onClick={() => onSelect && onSelect(post)}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Header: Deal Type Pill, Score, Time & Trash */}
        <div className="p-3.5 pb-2.5 flex items-center justify-between border-b border-slate-100/80 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${dealTypeBadge.bg}`}>
              <TypeIcon className="w-3 h-3" />
              {dealTypeBadge.label}
            </span>

            {score > 0 && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                +{score}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-400">
              {formatRelativeTime(published_at)}
            </span>

            <button
              onClick={handleDelete}
              className={`p-1.5 rounded-lg transition ${
                confirmDelete
                  ? 'text-white bg-rose-600 shadow-xs'
                  : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50'
              }`}
              title={confirmDelete ? 'Click again to confirm delete' : 'Delete deal'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Thumbnail Image (if available) */}
        {hasImage && (
          <div className="relative h-44 w-full bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-2">
            <img
              src={image_url}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          </div>
        )}

        {/* Body */}
        <div className="p-4">
          {/* Price & Store */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              {price !== null && price !== undefined ? formatCurrency(price) : (price_raw || 'Deal Price')}
            </span>

            {store && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Store className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[120px]">{store}</span>
              </span>
            )}
          </div>

          {/* Deal Title */}
          <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
            {title}
          </h4>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {description || 'Click to view deal details and coupon codes.'}
          </p>

          {/* Category tag & poster */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 mt-auto pt-1">
            {category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <Tag className="w-2.5 h-2.5" />
                {category}
              </span>
            )}
            {creator && (
              <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                by {creator}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition">
          <Eye className="w-3.5 h-3.5" />
          <span>Click to read</span>
        </span>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition shadow-xs"
            title="Open deal on Slickdeals"
          >
            <span>View Deal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}
