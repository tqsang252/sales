import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, ArrowRight, Image as ImageIcon } from 'lucide-react'
import { PlatformBadge } from '../common/PlatformBadge'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelativeTime } from '../../utils/formatDate'

export function RecentPosts({ posts = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Recent Sales Posts</h3>
          <p className="text-xs text-slate-500">Latest items detected across platforms</p>
        </div>
        <Link
          to="/feed"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">
          No recent posts found. Check your database or mock data.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {posts.map((post) => (
            <div
              key={post.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-lg px-2 -mx-2 transition"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.product_name || 'Product'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentNode.classList.add('bg-slate-100')
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {post.product_name || post.content?.slice(0, 50) || 'Untitled Post'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PlatformBadge platform={post.platform} />
                    <span className="text-xs text-slate-400">
                      {formatRelativeTime(post.published_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Link */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(post.price, post.currency)}
                </span>
                {post.original_url && (
                  <a
                    href={post.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition"
                    title="View Original Post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
