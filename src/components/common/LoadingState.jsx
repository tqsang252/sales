import React from 'react'

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm animate-pulse flex flex-col justify-between h-[360px]">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        {/* Thumbnail & Title */}
        <div className="h-40 w-full bg-slate-200 rounded-lg mb-3" />
        <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
        <div className="h-6 w-1/3 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-slate-200 rounded mb-3" />
        <div className="h-3 w-full bg-slate-100 rounded mb-1" />
        <div className="h-3 w-4/5 bg-slate-100 rounded" />
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded-md" />
      </div>
    </div>
  )
}

export function ListRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-lg shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 w-44 bg-slate-200 rounded" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        </div>
      </td>
      <td className="py-3 px-4"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
      <td className="py-3 px-4"><div className="h-5 w-16 bg-slate-200 rounded" /></td>
      <td className="py-3 px-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
      <td className="py-3 px-4"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
      <td className="py-3 px-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
      <td className="py-3 px-4 text-right"><div className="h-8 w-8 bg-slate-200 rounded ml-auto" /></td>
    </tr>
  )
}

export function LoadingGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function LoadingTable({ count = 6 }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <tbody>
          {Array.from({ length: count }).map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
