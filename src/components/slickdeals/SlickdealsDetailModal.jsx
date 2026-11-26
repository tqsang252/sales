import React, { useEffect, useState } from 'react'
import { X, ExternalLink, Trash2, Calendar, Flame, Star, Award, Store, Tag } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatStandardDate, formatRelativeTime } from '../../utils/formatDate'

export function SlickdealsDetailModal({ post, isOpen, onClose, onDelete }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setImgFailed(false)
    setConfirmDelete(false)
  }, [post])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !post) return null

  const {
    id,
    title,
    link,
    description,
    content_encoded,
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
    hot: { label: 'Hot Deal / Price Glitch', bg: 'bg-red-50 text-red-700 border-red-200', icon: Flame },
    popular: { label: 'Popular Deal', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Star },
    frontpage: { label: 'Frontpage Deal', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Award }
  }[deal_type] || { label: 'Deal', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Award }

  const TypeIcon = dealTypeBadge.icon

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${dealTypeBadge.bg}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {dealTypeBadge.label}
              </span>
              {score > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +{score} Votes
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDelete}
                className={`p-2 rounded-lg border transition flex items-center gap-1 text-xs font-semibold ${
                  confirmDelete
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-rose-600 hover:bg-rose-50'
                }`}
                title={confirmDelete ? 'Click again to confirm delete' : 'Delete this deal'}
              >
                <Trash2 className="w-4 h-4" />
                {confirmDelete && <span className="text-[11px] font-bold">Confirm</span>}
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Image */}
            {hasImage && (
              <div className="w-full max-h-72 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-2">
                <img
                  src={image_url}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full max-h-72 object-contain"
                  onError={() => setImgFailed(true)}
                />
              </div>
            )}

            {/* Price & Store Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {price !== null && price !== undefined ? formatCurrency(price) : (price_raw || 'Deal Price')}
                </span>
                {store && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs">
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    {store}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatStandardDate(published_at)}</span>
                <span>•</span>
                <span>{formatRelativeTime(published_at)}</span>
              </div>
            </div>

            {/* Deal Title */}
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {title}
            </h3>

            {/* Details & Description */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Deal Details & Instructions
              </p>
              <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
                {description || content_encoded || 'No details provided.'}
              </div>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
              {category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {category}
                </span>
              )}
              {creator && (
                <span>Posted by <strong className="text-slate-700">{creator}</strong> on Slickdeals</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
              >
                <span>View Deal on Slickdeals</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
