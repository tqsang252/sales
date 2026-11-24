import React, { useState } from 'react'
import { Bookmark, ExternalLink, MapPin, MessageSquareText, Trash2, Users } from 'lucide-react'
import { PlatformBadge } from '../common/PlatformBadge'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatStandardDate } from '../../utils/formatDate'

export function SalesListRow({ post, isFav, onToggleFav, onDelete, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    id,
    platform,
    author_name,
    group_name,
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
    new: 'New',
    used: 'Used',
    refurbished: 'Refurbished'
  }

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
    <tr
      onClick={() => onSelect && onSelect(post)}
      className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors cursor-pointer group"
    >
      {/* Product / Post */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
            {hasImage ? (
              <img
                src={image_url}
                alt={product_name || 'Listing'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <MessageSquareText className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="min-w-0 max-w-xs sm:max-w-md">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate transition-colors" title={product_name || content}>
              {product_name || content || 'Untitled Post'}
            </p>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              by <span className="text-slate-700 font-medium">{author_name || 'Anonymous'}</span>
              {category_name ? ` • ${category_name}` : ''}
            </p>
          </div>
        </div>
      </td>

      {/* Platform */}
      <td className="py-3 px-4 whitespace-nowrap">
        <PlatformBadge platform={platform} />
      </td>

      {/* Price / Type */}
      <td className="py-3 px-4 whitespace-nowrap">
        {hasPrice ? (
          <span className="font-bold text-sm text-slate-900">
            {formatCurrency(price, currency)}
          </span>
        ) : (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Deal Query
          </span>
        )}
      </td>

      {/* Location */}
      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-600">
        {location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {location}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>

      {/* Group Name instead of Condition */}
      <td className="py-3 px-4 whitespace-nowrap">
        {group_name ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 max-w-[220px] truncate" title={group_name}>
            <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{group_name}</span>
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </td>

      {/* Published Date */}
      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500">
        {formatStandardDate(published_at)}
      </td>

      {/* Actions: Favorite & Delete */}
      <td className="py-3 px-2 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFav(id)
            }}
            className={`p-1.5 rounded-lg transition ${
              isFav
                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isFav ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleDelete}
            className={`p-1.5 rounded-lg transition ${
              confirmDelete
                ? 'text-white bg-rose-600 shadow-xs'
                : 'text-slate-300 hover:text-rose-600 hover:bg-slate-100'
            }`}
            title={confirmDelete ? 'Click again to confirm delete' : 'Delete post'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>

      {/* Original URL Action */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        {original_url ? (
          <a
            href={original_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
            title="Open original post on Facebook"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        )}
      </td>
    </tr>
  )
}
