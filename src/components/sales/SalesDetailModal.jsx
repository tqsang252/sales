import React, { useEffect, useState } from 'react'
import { X, ExternalLink, Bookmark, Trash2, MapPin, Tag, Calendar, MessageSquareText } from 'lucide-react'
import { PlatformBadge } from '../common/PlatformBadge'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatStandardDate, formatRelativeTime } from '../../utils/formatDate'

export function SalesDetailModal({ post, isOpen, onClose, isFav, onToggleFav, onDelete }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setImgFailed(false)
    setConfirmDelete(false)
  }, [post])

  // Close on Escape key
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
    platform,
    author_name,
    product_name,
    content,
    image_url,
    price,
    currency,
    location,
    condition,
    category_name,
    published_at,
    original_url
  } = post

  const isDirectImage = (url) => {
    if (!url || typeof url !== 'string') return false
    if (url.includes('photo.php') || url.includes('facebook.com/photo')) return false
    return true
  }

  const hasImage = Boolean(image_url) && isDirectImage(image_url) && !imgFailed
  const hasPrice = price !== null && price !== undefined && !isNaN(Number(price))

  const conditionLabels = {
    new: 'New / Sealed',
    used: 'Used',
    refurbished: 'Refurbished',
    unknown: 'General'
  }

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
        {/* Modal Dialog Card */}
        <div
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <PlatformBadge platform={platform} />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {author_name || 'Anonymous User'}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{formatStandardDate(published_at)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(published_at)}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions: Favorite, Delete, Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleFav(id)}
                className={`p-2 rounded-lg border transition ${
                  isFav
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>

              <button
                onClick={handleDelete}
                className={`p-2 rounded-lg border transition flex items-center gap-1 text-xs font-semibold ${
                  confirmDelete
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-rose-600 hover:bg-rose-50'
                }`}
                title={confirmDelete ? 'Click again to confirm delete' : 'Delete this post'}
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

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Image (if available) */}
            {hasImage && (
              <div className="w-full max-h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                <img
                  src={image_url}
                  alt={product_name || 'Listing'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full max-h-80 object-contain bg-slate-50"
                  onError={() => setImgFailed(true)}
                />
              </div>
            )}

            {/* Price & Meta Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                {hasPrice ? (
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {formatCurrency(price, currency)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <MessageSquareText className="w-4 h-4 text-amber-600" />
                    Community Deal / Discussion
                  </span>
                )}

                {condition && condition !== 'unknown' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                    {conditionLabels[condition] || condition}
                  </span>
                )}
              </div>

              {location && (
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{location}</span>
                </div>
              )}
            </div>

            {/* Product Title (if present) */}
            {product_name && (
              <div>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {product_name}
                </h4>
              </div>
            )}

            {/* Full Post Content */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Post Content
              </p>
              <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 font-normal select-text">
                {content || 'No content provided in this post.'}
              </div>
            </div>

            {/* Tags */}
            {category_name && (
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {category_name}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>

            {original_url ? (
              <a
                href={original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
              >
                <span>View Original Post on {platform === 'facebook' ? 'Facebook' : platform === 'tiktok' ? 'TikTok' : 'Source'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-400 italic">No external link available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
