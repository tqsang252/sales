import React from 'react'
import { Bookmark, ExternalLink, MapPin, Tag, MessageSquareText } from 'lucide-react'
import { PlatformBadge } from '../common/PlatformBadge'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelativeTime } from '../../utils/formatDate'

export function SalesCard({ post, isFav, onToggleFav }) {
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
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Header: Platform, Author, Time & Fav */}
        <div className="p-3.5 pb-2.5 flex items-center justify-between border-b border-slate-100/80 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <PlatformBadge platform={platform} />
            <span className="text-xs font-semibold text-slate-800 truncate" title={author_name}>
              {author_name || 'Anonymous User'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-400">
              {formatRelativeTime(published_at)}
            </span>
            <button
              onClick={() => onToggleFav(id)}
              className={`p-1.5 rounded-lg transition ${
                isFav
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title={isFav ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. NẾU CÓ ẢNH: Hiển thị banner ảnh sản phẩm */}
        {hasImage && (
          <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
            <img
              src={image_url}
              alt={product_name || 'Listing'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            {condition && condition !== 'unknown' && (
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-slate-800 shadow-xs border border-slate-200/80 uppercase tracking-wider">
                {conditionLabels[condition] || condition}
              </span>
            )}
          </div>
        )}

        {/* Card Body */}
        <div className="p-4">
          {/* Price / Type Badge */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            {hasPrice ? (
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                {formatCurrency(price, currency)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <MessageSquareText className="w-3 h-3 text-amber-600" />
                Community Deal / Query
              </span>
            )}

            {location && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 truncate" title={location}>
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{location}</span>
              </span>
            )}
          </div>

          {/* Product Name (nếu có) */}
          {product_name && (
            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-2">
              {product_name}
            </h4>
          )}

          {/* Post Content: Tự thích ứng độ dài */}
          {/* Nếu không có ảnh, cho phép hiển thị nội dung dài hơn (4-5 dòng) với cỡ chữ dễ đọc như bài viết mạng xã hội */}
          <p className={`text-slate-700 leading-relaxed mb-3 ${
            hasImage
              ? 'text-xs line-clamp-2 text-slate-500'
              : 'text-sm font-normal line-clamp-4 bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-slate-800 italic'
          }`}>
            "{content || 'No content available.'}"
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-auto">
            {category_name && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <Tag className="w-2.5 h-2.5" />
                {category_name}
              </span>
            )}
            {!hasImage && condition && condition !== 'unknown' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {conditionLabels[condition] || condition}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          {hasImage ? 'Product Listing' : 'Social Post'}
        </span>

        {original_url ? (
          <a
            href={original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition shadow-xs"
          >
            <span>View Post</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">No link</span>
        )}
      </div>
    </div>
  )
}
