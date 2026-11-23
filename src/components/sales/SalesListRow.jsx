import React from 'react'
import { Bookmark, ExternalLink, MapPin, MessageSquareText } from 'lucide-react'
import { PlatformBadge } from '../common/PlatformBadge'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatStandardDate } from '../../utils/formatDate'

export function SalesListRow({ post, isFav, onToggleFav }) {
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

  const hasImage = Boolean(image_url)
  const hasPrice = price !== null && price !== undefined && !isNaN(Number(price))

  const conditionLabels = {
    new: 'New',
    used: 'Used',
    refurbished: 'Refurbished'
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
      {/* Product / Post */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
            {hasImage ? (
              <img
                src={image_url}
                alt={product_name || 'Listing'}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <MessageSquareText className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="min-w-0 max-w-xs sm:max-w-md">
            <p className="text-sm font-semibold text-slate-900 truncate" title={product_name || content}>
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

      {/* Condition */}
      <td className="py-3 px-4 whitespace-nowrap">
        {condition && condition !== 'unknown' ? (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {conditionLabels[condition] || condition}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </td>

      {/* Published Date */}
      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500">
        {formatStandardDate(published_at)}
      </td>

      {/* Favorite Toggle */}
      <td className="py-3 px-2 text-center whitespace-nowrap">
        <button
          onClick={() => onToggleFav(id)}
          className={`p-1.5 rounded-lg transition ${
            isFav
              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
              : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
          }`}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
        </button>
      </td>

      {/* Original URL Action */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        {original_url ? (
          <a
            href={original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
            title="View Original Post"
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
